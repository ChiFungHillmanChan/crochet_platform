import { getFirebaseDb } from "@/lib/firebase";
import type { QueryDocumentSnapshot, DocumentSnapshot } from "firebase/firestore";
import type { Product, Category } from "@/lib/types";

export interface PaginatedResult {
  products: Product[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

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

export async function getAllProducts(): Promise<Product[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, orderBy, limit } = await import(
    "firebase/firestore"
  );

  const q = query(
    collection(db, "products"),
    orderBy("createdAt", "desc"),
    limit(200)
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

export async function getProductsPaginated(
  pageSize = 20,
  cursor?: DocumentSnapshot | null,
  categorySlug?: string
): Promise<PaginatedResult> {
  const db = await getFirebaseDb();
  const {
    collection, getDocs, query, where, orderBy, limit, startAfter,
  } = await import("firebase/firestore");

  const constraints = [
    where("isActive", "==", true),
    ...(categorySlug ? [where("categorySlug", "==", categorySlug)] : []),
    orderBy("createdAt", "desc"),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(pageSize + 1),
  ];

  const q = query(collection(db, "products"), ...constraints);
  const snap = await getDocs(q);
  const hasMore = snap.docs.length > pageSize;
  const docs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;

  return {
    products: docs.map(docToProduct),
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
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
