import { getFirebaseDb } from "@/lib/firebase";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { Product, Category } from "@/lib/types";

function docToProduct(doc: QueryDocumentSnapshot): Product {
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  } as Product;
}

export async function getProducts(): Promise<Product[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy, limit } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map(docToProduct);
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
  return snap.docs.map(docToProduct);
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
    where("isActive", "==", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  return docToProduct(snap.docs[0]);
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: string,
  limitCount = 4
): Promise<Product[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy, limit } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    where("isActive", "==", true),
    where("categorySlug", "==", categorySlug),
    orderBy("createdAt", "desc"),
    limit(limitCount + 1)
  );
  const snap = await getDocs(q);
  const products = snap.docs
    .map(docToProduct)
    .filter((p) => p.id !== excludeId);

  // Shuffle using Fisher-Yates
  for (let i = products.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [products[i], products[j]] = [products[j], products[i]];
  }

  return products.slice(0, limitCount);
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
