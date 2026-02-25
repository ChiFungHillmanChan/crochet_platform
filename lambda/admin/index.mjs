import Stripe from "stripe";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { firebaseAuth, db } from "../shared/firebase-admin.mjs";
import { success, error } from "../shared/response.mjs";

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
const FRONTEND_URL = process.env.FRONTEND_URL || "https://cosyloops.com";

function isAdmin(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

async function verifyAuth(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    if (!isAdmin(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}

async function createCheckoutSession(body, origin) {
  const { items, userId, customerName, customerEmail } = body;
  if (!items?.length) return error(400, "No items provided", origin);

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "gbp",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${FRONTEND_URL}/en/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/en/cart/`,
    customer_email: customerEmail,
    metadata: {
      userId: userId || "",
      customerName: customerName || "",
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image || "",
        }))
      ),
    },
  });

  return success({ sessionId: session.id, url: session.url }, origin);
}

async function createProduct(body, origin) {
  const { name, slug, description, price, stock, categorySlug, images, isActive } = body;
  if (!name || !slug) return error(400, "Name and slug required", origin);

  const ref = await db.collection("products").add({
    name, slug, description: description || "",
    price: price || 0, stock: stock || 0,
    categorySlug: categorySlug || "",
    images: images || [], isActive: isActive ?? true,
    createdAt: new Date(),
  });
  return success({ id: ref.id }, origin);
}

async function updateProduct(body, origin) {
  const { id, ...updates } = body;
  if (!id) return error(400, "Product ID required", origin);

  await db.collection("products").doc(id).update(updates);
  return success({ updated: true }, origin);
}

async function deleteProduct(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Product ID required", origin);

  await db.collection("products").doc(id).delete();
  return success({ deleted: true }, origin);
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

async function getUploadUrl(body, origin) {
  const { filename, contentType } = body;
  if (!filename) return error(400, "Filename required", origin);
  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) {
    return error(500, "R2 not configured", origin);
  }

  const sanitised = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `products/${Date.now()}-${sanitised}`;

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
  const [ordersSnap, productsSnap] = await Promise.all([
    db.collection("orders").get(),
    db.collection("products").where("isActive", "==", true).get(),
  ]);

  const orders = ordersSnap.docs.map((d) => d.data());
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return success({
    totalOrders: orders.length,
    totalRevenue,
    totalProducts: productsSnap.size,
    pendingOrders,
  }, origin);
}

export async function handler(event) {
  const origin = event.headers?.origin || "";

  if (event.httpMethod === "OPTIONS") {
    return success({}, origin);
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const action = body.action || event.queryStringParameters?.action;

  // Public endpoint: create-checkout-session (requires user auth, not admin)
  if (action === "create-checkout-session") {
    try {
      return await createCheckoutSession(body, origin);
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
      case "get-upload-url":
        return await getUploadUrl(body, origin);
      default:
        return error(400, `Unknown action: ${action}`, origin);
    }
  } catch (err) {
    console.error(`Admin action ${action} error:`, err);
    return error(500, "Internal server error", origin);
  }
}
