import { db } from "../shared/firebase-admin.mjs";
import { success, error } from "../shared/response.mjs";

export async function getReviews(origin) {
  const snap = await db
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  const reviews = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return success({ reviews }, origin);
}

export async function createReview(body, origin) {
  const { productId, authorName, rating, body: reviewBody, isApproved } = body;
  if (!productId || !authorName || !rating) {
    return error(400, "productId, authorName, and rating required", origin);
  }

  const ref = await db.collection("reviews").add({
    productId,
    authorName,
    rating: Math.min(5, Math.max(1, parseInt(rating) || 1)),
    body: reviewBody || "",
    isApproved: isApproved ?? false,
    createdAt: new Date(),
  });
  return success({ id: ref.id }, origin);
}

export async function updateReview(body, origin) {
  const { id, ...updates } = body;
  if (!id) return error(400, "Review ID required", origin);

  if (updates.rating) {
    updates.rating = Math.min(5, Math.max(1, parseInt(updates.rating) || 1));
  }

  await db.collection("reviews").doc(id).update(updates);
  return success({ updated: true }, origin);
}

export async function deleteReview(body, origin) {
  const { id } = body;
  if (!id) return error(400, "Review ID required", origin);

  await db.collection("reviews").doc(id).delete();
  return success({ deleted: true }, origin);
}
