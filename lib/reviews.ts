import { getFirebaseDb } from "@/lib/firebase";
import type { Review } from "@/lib/types";

export async function getReviewsByProduct(
  productId: string
): Promise<Review[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  })) as Review[];
}
