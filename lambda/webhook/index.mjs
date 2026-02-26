import { createHmac, timingSafeEqual } from "crypto";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { db } from "../shared/firebase-admin.mjs";
import {
  buildOrderConfirmationEmail,
  buildAdminNotificationEmail,
} from "./emails.mjs";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@cosyloops.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ses = new SESClient({ region: process.env.AWS_REGION || "eu-west-2" });

function verifyStripeSignature(payload, sigHeader) {
  if (!STRIPE_WEBHOOK_SECRET || !sigHeader) return false;

  const elements = sigHeader.split(",");
  const timestamp = elements.find((e) => e.startsWith("t="))?.split("=")[1];
  const signature = elements.find((e) => e.startsWith("v1="))?.split("=")[1];
  if (!timestamp || !signature) return false;

  const parsedTimestamp = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(parsedTimestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parsedTimestamp) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  try {
    const expectedBuf = Buffer.from(expected, "hex");
    const signatureBuf = Buffer.from(signature, "hex");
    if (expectedBuf.length !== signatureBuf.length) return false;
    return timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}

async function getProcessedStripeEvent(eventId) {
  const snap = await db.doc(`stripeEvents/${eventId}`).get();
  if (!snap.exists) return null;
  return snap.data() || null;
}

async function markStripeEvent(eventId, payload, options = {}) {
  const now = new Date().toISOString();
  const { markProcessed = true } = options;
  const data = { ...payload, lastAttemptAt: now };
  if (markProcessed) data.processedAt = now;
  await db.doc(`stripeEvents/${eventId}`).set(data, { merge: true });
}

function generateOrderNumber() {
  const date = new Date();
  const prefix = `CL${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${random}`;
}

function buildAddressFromMetadata(metadata) {
  if (!metadata.shippingLine1) return null;
  return {
    line1: metadata.shippingLine1 || "",
    line2: metadata.shippingLine2 || "",
    city: metadata.shippingCity || "",
    postcode: metadata.shippingPostcode || "",
    country: metadata.shippingCountry || "GB",
  };
}

function buildAddressFromStripe(address) {
  if (!address) return null;
  return {
    line1: address.line1 || "",
    line2: address.line2 || "",
    city: address.city || "",
    postcode: address.postal_code || "",
    country: address.country || "GB",
  };
}

async function handleCheckoutCompleted(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || "";
  const source = metadata.source || "checkout";
  const isPaymentLink = source === "payment_link";

  const items = isPaymentLink
    ? [{ productId: "payment-link", name: metadata.productName || "Payment Link Order", price: session.amount_total, quantity: 1 }]
    : JSON.parse(metadata.items || "[]");

  // Extract customer details from metadata (custom checkout) or session (payment link)
  const customerDetails = session.customer_details || {};
  const customerPhone = metadata.customerPhone || customerDetails.phone || "";
  const shippingAddress = isPaymentLink
    ? buildAddressFromStripe(customerDetails.address || session.shipping_details?.address)
    : buildAddressFromMetadata(metadata);
  const notes = metadata.notes || "";

  const orderNumber = generateOrderNumber();
  const order = {
    orderNumber,
    customerEmail: customerDetails.email || session.customer_email || "",
    customerName: customerDetails.name || metadata.customerName || "",
    customerPhone,
    shippingAddress,
    notes,
    source,
    items,
    totalAmount: session.amount_total,
    status: "paid",
    stripeSessionId: session.id,
    userId,
    createdAt: new Date(),
  };

  const orderRef = await db.collection("orders").add(order);
  order.id = orderRef.id;

  // Decrement stock for each item (skip for payment link orders)
  if (!isPaymentLink) {
    const batch = db.batch();
    for (const item of items) {
      const productQuery = await db
        .collection("products")
        .where("slug", "==", item.productId)
        .limit(1)
        .get();

      if (!productQuery.empty) {
        const productDoc = productQuery.docs[0];
        const currentStock = productDoc.data().stock || 0;
        batch.update(productDoc.ref, {
          stock: Math.max(0, currentStock - item.quantity),
        });
      }
    }
    await batch.commit();
  }

  // Send confirmation email to customer
  try {
    const customerEmail = buildOrderConfirmationEmail(order);
    await ses.send(
      new SendEmailCommand({
        Source: SENDER_EMAIL,
        Destination: { ToAddresses: [order.customerEmail] },
        Message: {
          Subject: { Data: customerEmail.subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: customerEmail.html, Charset: "UTF-8" },
            Text: { Data: customerEmail.text, Charset: "UTF-8" },
          },
        },
      })
    );
  } catch (err) {
    console.error("Failed to send customer email:", err);
  }

  // Send notification to admin
  if (ADMIN_EMAIL) {
    try {
      const adminEmail = buildAdminNotificationEmail(order);
      await ses.send(
        new SendEmailCommand({
          Source: SENDER_EMAIL,
          Destination: { ToAddresses: [ADMIN_EMAIL] },
          Message: {
            Subject: { Data: adminEmail.subject, Charset: "UTF-8" },
            Body: {
              Html: { Data: adminEmail.html, Charset: "UTF-8" },
              Text: { Data: adminEmail.text, Charset: "UTF-8" },
            },
          },
        })
      );
    } catch (err) {
      console.error("Failed to send admin email:", err);
    }
  }

  return order;
}

export async function handler(event) {
  const sigHeader = event.headers?.["stripe-signature"] || "";
  const body = event.body || "";

  if (!verifyStripeSignature(body, sigHeader)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid signature" }) };
  }

  const stripeEvent = JSON.parse(body);

  // Deduplication check
  const existing = await getProcessedStripeEvent(stripeEvent.id);
  if (existing?.processedAt) {
    return { statusCode: 200, body: JSON.stringify({ received: true, deduplicated: true }) };
  }

  await markStripeEvent(stripeEvent.id, { type: stripeEvent.type }, { markProcessed: false });

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      await handleCheckoutCompleted(stripeEvent.data.object);
    }
    await markStripeEvent(stripeEvent.id, { type: stripeEvent.type });
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("Webhook processing error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Processing failed" }) };
  }
}
