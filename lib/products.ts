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

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: string,
  limit = 4
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
  const products = snap.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
    }))
    .filter((p) => p.id !== excludeId) as Product[];

  // Shuffle using Fisher-Yates
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }

  return products.slice(0, limit);
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
