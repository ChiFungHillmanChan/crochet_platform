import { db } from "../shared/firebase-admin.mjs";
import { success, error } from "../shared/response.mjs";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://cosyloops.com";

export async function createPaymentLink(body, origin, stripe) {
  const { productName, amountPence } = body;
  if (!productName || !amountPence) {
    return error(400, "productName and amountPence required", origin);
  }

  const parsedAmount = parseInt(amountPence, 10);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return error(400, "amountPence must be a positive integer", origin);
  }

  const product = await stripe.products.create({ name: productName });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: parsedAmount,
    currency: "gbp",
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["GB"],
    },
    after_completion: {
      type: "redirect",
      redirect: { url: `${FRONTEND_URL}/en/checkout/success/` },
    },
    metadata: { source: "payment_link", productName },
  });

  const linkDoc = {
    stripePaymentLinkId: paymentLink.id,
    url: paymentLink.url,
    productName,
    amountPence: parsedAmount,
    active: true,
    createdAt: new Date(),
  };

  const ref = await db.collection("paymentLinks").add(linkDoc);
  return success({ id: ref.id, ...linkDoc }, origin);
}

export async function getPaymentLinks(origin) {
  const snap = await db
    .collection("paymentLinks")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  const links = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return success({ links }, origin);
}

export async function deactivatePaymentLink(body, origin, stripe) {
  const { id } = body;
  if (!id) return error(400, "Payment link ID required", origin);

  const doc = await db.collection("paymentLinks").doc(id).get();
  if (!doc.exists) return error(404, "Payment link not found", origin);

  const { stripePaymentLinkId } = doc.data();
  await stripe.paymentLinks.update(stripePaymentLinkId, { active: false });
  await db.collection("paymentLinks").doc(id).update({ active: false });

  return success({ deactivated: true }, origin);
}
