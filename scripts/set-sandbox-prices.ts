/**
 * Sets all products to £20 (2000 pence) for sandbox testing.
 * Run with: pnpm tsx scripts/set-sandbox-prices.ts
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT || "", "base64").toString()
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const SANDBOX_PRICE = 2000; // £20 in pence

async function main() {
  const snap = await db.collection("products").get();
  console.log(`Found ${snap.size} products. Setting all to £${SANDBOX_PRICE / 100}...`);

  const batch = db.batch();
  for (const doc of snap.docs) {
    batch.update(doc.ref, { price: SANDBOX_PRICE });
  }
  await batch.commit();

  console.log(`Done. All ${snap.size} products updated to ${SANDBOX_PRICE} pence (£${SANDBOX_PRICE / 100}).`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
