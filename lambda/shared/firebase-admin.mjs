import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is required");
  }
  let sa;
  try {
    sa = JSON.parse(Buffer.from(raw, "base64").toString());
  } catch (err) {
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT: ${err.message}`);
  }
  initializeApp({ credential: cert(sa) });
}

export const firebaseAuth = getAuth();
export const db = getFirestore();
