/**
 * Set up admin accounts in Firestore.
 * Run with: FIREBASE_SERVICE_ACCOUNT=<base64> npx tsx scripts/setup-admins.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (getApps().length === 0) {
  const sa = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT ?? "", "base64").toString()
  );
  initializeApp({ credential: cert(sa) });
}

const db = getFirestore();
const auth = getAuth();

const admins = [
  { email: "hillmanchan709@gmail.com", name: "Hillman Chan" },
  { email: "choysy@gmail.com", name: "Choysy" },
];

async function run() {
  for (const admin of admins) {
    let uid: string | null = null;
    try {
      const userRecord = await auth.getUserByEmail(admin.email);
      uid = userRecord.uid;
      console.log(`Found existing auth user: ${admin.email} (uid: ${uid})`);
    } catch {
      console.log(
        `No auth user yet for ${admin.email} — will be set on first sign-in`
      );
    }

    if (uid) {
      await db.collection("users").doc(uid).set(
        {
          email: admin.email,
          name: admin.name,
          role: "admin",
          createdAt: new Date(),
        },
        { merge: true }
      );
      console.log(`  -> Firestore admin doc created for uid: ${uid}`);
    }
  }

  console.log(
    "\nLambda ADMIN_EMAILS: hillmanchan709@gmail.com,choysy@gmail.com"
  );
  console.log("Done!");
}

run().catch(console.error);
