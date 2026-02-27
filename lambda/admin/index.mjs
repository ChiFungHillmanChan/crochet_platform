import Stripe from "stripe";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../shared/firebase-admin.mjs";
import { verifyToken } from "../shared/auth.mjs";
import { success, error } from "../shared/response.mjs";
import { getReviews, createReview, updateReview, deleteReview } from "./reviews.mjs";
import { createPaymentLink, getPaymentLinks, deactivatePaymentLink } from "./payment-links.mjs";
import { createCheckoutSession } from "./checkout.mjs";
import { validateProduct } from "../shared/validate.mjs";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { buildShippingNotificationEmail } from "../webhook/emails.mjs";

const ses = new SESClient({ region: process.env.AWS_REGION || "eu-west-2" });
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@cosyloops.com";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

let r2Client = null;
function getR2Client() {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2Client;
}
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
function isAdmin(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

async function verifyAuth(event) {
  const decoded = await verifyToken(event);
  if (!decoded || !isAdmin(decoded.email)) return null;
  return decoded;
}

async function createProduct(body, origin) {
  const { name, slug, description, price, stock, categorySlug, images, isActive } = body;
  if (!name || !slug) return error(400, "Name and slug required", origin);

  const validationErrors = validateProduct(body, false);
  if (validationErrors.length > 0) {
    return error(400, validationErrors.join("; "), origin);
  }

  const existing = await db.collection("products").where("slug", "==", slug).limit(1).get();
  if (!existing.empty) return error(409, `Product with slug "${slug}" already exists`, origin);

  const { media } = body;
  const ref = await db.collection("products").add({
    name, slug, description: description || "",
    price: price || 0, stock: stock || 0,
    categorySlug: categorySlug || "",
    images: images || [], media: media || [],
    isActive: isActive ?? true, isArchived: false,
    createdAt: new Date(),
  });
  return success({ id: ref.id }, origin);
}

const PRODUCT_ALLOWED_FIELDS = ["name", "slug", "description", "price", "stock", "categorySlug", "images", "isActive", "isArchived", "media"];

async function updateProduct(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Product ID required", origin);

  const validationErrors = validateProduct(body, true);
  if (validationErrors.length > 0) {
    return error(400, validationErrors.join("; "), origin);
  }

  const updates = {};
  for (const field of PRODUCT_ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  if (Object.keys(updates).length === 0) {
    return error(400, "No valid fields to update", origin);
  }

  await db.collection("products").doc(id).update(updates);
  return success({ updated: true }, origin);
}

async function deleteProduct(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Product ID required", origin);

  await db.collection("products").doc(id).delete();
  return success({ deleted: true }, origin);
}

async function archiveProduct(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Product ID required", origin);

  await db.collection("products").doc(id).update({
    isArchived: true,
    isActive: false,
  });
  return success({ archived: true }, origin);
}

async function restoreProduct(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Product ID required", origin);

  await db.collection("products").doc(id).update({
    isArchived: false,
  });
  return success({ restored: true }, origin);
}

async function updateOrderStatus(body, origin) {
  const { id, status } = body;
  const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!id || !validStatuses.includes(status)) {
    return error(400, "Valid order ID and status required", origin);
  }

  await db.collection("orders").doc(id).update({ status });
  return success({ updated: true }, origin);
}

async function getOrders(origin) {
  const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(100).get();
  const orders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return success({ orders }, origin);
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

async function getUploadUrl(body, origin, userEmail) {
  const { filename, contentType, productSlug, mediaType } = body;
  if (!filename) return error(400, "Filename required", origin);

  const isVideo = mediaType === "videos" || contentType?.startsWith("video/");
  const allowedTypes = isVideo ? ALLOWED_MEDIA_TYPES : ALLOWED_IMAGE_TYPES;
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (contentType && !allowedTypes.includes(contentType)) {
    return error(400, `Invalid content type. Allowed: ${allowedTypes.join(", ")}`, origin);
  }
  if (body.fileSize && body.fileSize > maxSize) {
    return error(400, `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`, origin);
  }
  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) {
    return error(500, "R2 not configured", origin);
  }

  const sanitised = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const emailPrefix = (userEmail || "unknown").replace(/[^a-zA-Z0-9._-]/g, "_");
  const slugPrefix = (productSlug || "general").replace(/[^a-zA-Z0-9._-]/g, "_");
  const folder = mediaType || "images";
  const key = `${emailPrefix}/${slugPrefix}/${folder}/${Date.now()}-${sanitised}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType || "image/jpeg",
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 600,
  });
  const publicUrl = `${R2_PUBLIC_URL}/${key}`;

  return success({ uploadUrl, publicUrl }, origin);
}

async function getDashboardStats(origin) {
  const [statsSnap, productsCount, usersCount, pendingSnap] = await Promise.all([
    db.doc("stats/dashboard").get(),
    db.collection("products").where("isActive", "==", true).count().get(),
    db.collection("users").count().get(),
    db.collection("orders").where("status", "==", "pending").count().get(),
  ]);

  const stats = statsSnap.exists ? statsSnap.data() : {};

  return success({
    totalOrders: stats.totalOrders || 0,
    totalRevenue: stats.totalRevenue || 0,
    totalProducts: productsCount.data().count,
    pendingOrders: pendingSnap.data().count,
    totalUsers: usersCount.data().count,
  }, origin);
}

async function setAdminRole(body, origin) {
  const { userId } = body;
  if (!userId) return error(400, "userId required", origin);

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return error(404, "User not found", origin);

  const email = userDoc.data().email || "";
  if (!isAdmin(email)) return error(403, "Email not in admin list", origin);

  await db.collection("users").doc(userId).update({ role: "admin" });
  return success({ updated: true }, origin);
}

export async function handler(event) {
  const origin = event.headers?.origin || "";

  if (event.httpMethod === "OPTIONS") {
    return success({}, origin);
  }

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return error(400, "Invalid JSON body", origin);
  }
  const action = body.action || event.queryStringParameters?.action;

  // Public endpoint: create-checkout-session (requires user auth, not admin)
  if (action === "create-checkout-session") {
    try {
      return await createCheckoutSession(body, origin, event, stripe);
    } catch (err) {
      console.error("Checkout error:", err);
      return error(500, "Failed to create checkout session", origin);
    }
  }

  // All other actions require admin auth
  const user = await verifyAuth(event);
  if (!user) return error(401, "Unauthorized", origin);

  try {
    switch (action) {
      case "create-product":
        return await createProduct(body, origin);
      case "update-product":
        return await updateProduct(body, origin);
      case "delete-product":
        return await deleteProduct(body, origin);
      case "update-order-status":
        return await updateOrderStatus(body, origin);
      case "get-orders":
        return await getOrders(origin);
      case "get-dashboard-stats":
        return await getDashboardStats(origin);
      case "archive-product":
        return await archiveProduct(body, origin);
      case "restore-product":
        return await restoreProduct(body, origin);
      case "get-upload-url":
        return await getUploadUrl(body, origin, user.email);
      case "get-reviews":
        return await getReviews(origin);
      case "create-review":
        return await createReview(body, origin);
      case "update-review":
        return await updateReview(body, origin);
      case "delete-review":
        return await deleteReview(body, origin);
      case "create-payment-link":
        return await createPaymentLink(body, origin, stripe);
      case "get-payment-links":
        return await getPaymentLinks(origin);
      case "deactivate-payment-link":
        return await deactivatePaymentLink(body, origin, stripe);
      case "set-admin-role":
        return await setAdminRole(body, origin);
      case "mark-shipped": {
        const { orderId, trackingNumber, carrier } = body;
        if (!orderId) return error(400, "Order ID required", origin);
        const orderDoc = await db.doc(`orders/${orderId}`).get();
        if (!orderDoc.exists) return error(404, "Order not found", origin);
        const orderData = { id: orderId, ...orderDoc.data() };
        await db.doc(`orders/${orderId}`).update({
          status: "shipped",
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          shippedAt: new Date(),
        });
        if (orderData.customerEmail) {
          try {
            const email = buildShippingNotificationEmail(orderData, trackingNumber, carrier);
            await ses.send(new SendEmailCommand({
              Source: SENDER_EMAIL,
              Destination: { ToAddresses: [orderData.customerEmail] },
              Message: {
                Subject: { Data: email.subject, Charset: "UTF-8" },
                Body: {
                  Html: { Data: email.html, Charset: "UTF-8" },
                  Text: { Data: email.text, Charset: "UTF-8" },
                },
              },
            }));
          } catch (err) {
            console.error("Shipping email failed:", err);
          }
        }
        return success({ updated: true }, origin);
      }
      case "get-customers": {
        const ordersSnap = await db.collection("orders").orderBy("createdAt", "desc").limit(500).get();
        const customerMap = new Map();
        ordersSnap.docs.forEach((doc) => {
          const order = doc.data();
          if (!order.customerEmail) return;
          const key = order.customerEmail.toLowerCase();
          const existing = customerMap.get(key);
          if (existing) {
            existing.orderCount++;
            existing.totalSpent += order.totalAmount || 0;
            const orderDate = order.createdAt?.toDate?.() || new Date(0);
            if (orderDate > existing.lastOrderDate) existing.lastOrderDate = orderDate;
          } else {
            customerMap.set(key, {
              email: order.customerEmail,
              name: order.customerName || "Unknown",
              phone: order.customerPhone || "",
              orderCount: 1,
              totalSpent: order.totalAmount || 0,
              lastOrderDate: order.createdAt?.toDate?.() || new Date(),
            });
          }
        });
        const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
        return success({ customers }, origin);
      }
      default:
        return error(400, `Unknown action: ${action}`, origin);
    }
  } catch (err) {
    console.error(`Admin action ${action} error:`, err);
    return error(500, "Internal server error", origin);
  }
}
