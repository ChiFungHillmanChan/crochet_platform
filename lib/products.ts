import { getFirebaseDb } from "@/lib/firebase";
import type { Product, Category } from "@/lib/types";

export async function getProducts(): Promise<Product[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  })) as Product[];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    where("isActive", "==", true),
    where("categorySlug", "==", categorySlug),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  })) as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, limit } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    where("slug", "==", slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const doc = snap.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  } as Product;
}

export async function getCategories(): Promise<Category[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore"
  );

  const q = query(collection(db, "categories"), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}
