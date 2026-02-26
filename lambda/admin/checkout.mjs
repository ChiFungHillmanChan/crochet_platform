import { firebaseAuth, db } from "../shared/firebase-admin.mjs";
import { success, error } from "../shared/response.mjs";

async function verifyCheckoutAuth(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  try {
    return await firebaseAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function createCheckoutSession(body, origin, event, stripe) {
  const FRONTEND_URL = process.env.FRONTEND_URL || "https://cosyloops.com";
  const { items, userId, customerName, customerEmail, customerPhone, shippingAddress, notes, locale } = body;
  if (!items?.length) return error(400, "No items provided", origin);

  // Optional auth for logged-in users (guest checkout is allowed)
  const authedUser = await verifyCheckoutAuth(event);
  const resolvedUserId = authedUser?.uid || userId || "";

  const validLocale = ["en", "zh-hk"].includes(locale) ? locale : "en";

  // Server-side price validation: look up each product from Firestore
  const verifiedItems = [];
  for (const item of items) {
    if (!item.productId) continue;

    const productQuery = await db
      .collection("products")
      .where("slug", "==", item.productId)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (productQuery.empty) {
      return error(400, `Product not found or inactive: ${item.productId}`, origin);
    }

    const productDoc = productQuery.docs[0];
    const product = productDoc.data();

    // Clamp quantity between 1 and available stock
    const quantity = Math.max(1, Math.min(item.quantity || 1, product.stock || 0));
    if (quantity === 0) {
      return error(400, `Product out of stock: ${product.name}`, origin);
    }

    verifiedItems.push({
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (!verifiedItems.length) {
    return error(400, "No valid items after verification", origin);
  }

  const lineItems = verifiedItems.map((item) => ({
    price_data: {
      currency: "gbp",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  // Shipping: free for orders >= £50, otherwise £3.99
  const FREE_SHIPPING_THRESHOLD = 5000; // pence
  const SHIPPING_RATE_STANDARD = process.env.STRIPE_SHIPPING_RATE_STANDARD || "shr_1T4ukUIpw9oLScWbeG2OiKRA";
  const SHIPPING_RATE_FREE = process.env.STRIPE_SHIPPING_RATE_FREE || "shr_1T4ukVIpw9oLScWbcrGEUxom";
  const orderTotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingOptions = orderTotal >= FREE_SHIPPING_THRESHOLD
    ? [{ shipping_rate: SHIPPING_RATE_FREE }]
    : [{ shipping_rate: SHIPPING_RATE_STANDARD }];

  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",
    line_items: lineItems,
    shipping_options: shippingOptions,
    mode: "payment",
    return_url: `${FRONTEND_URL}/${validLocale}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: customerEmail,
    metadata: {
      userId: resolvedUserId,
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      shippingLine1: shippingAddress?.line1 || "",
      shippingLine2: shippingAddress?.line2 || "",
      shippingCity: shippingAddress?.city || "",
      shippingPostcode: shippingAddress?.postcode || "",
      shippingCountry: shippingAddress?.country || "GB",
      notes: notes || "",
      source: "checkout",
      items: JSON.stringify(verifiedItems),
    },
  });

  return success({ clientSecret: session.client_secret }, origin);
}
