import { firebaseAuth } from "./firebase-admin.mjs";

export async function verifyToken(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;
  try {
    return await firebaseAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}
