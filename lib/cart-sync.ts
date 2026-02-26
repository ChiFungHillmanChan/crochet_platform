"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/stores/cartStore";
import { getFirebaseDb } from "@/lib/firebase";
import type { CartItem } from "@/lib/types";

/** Load cart from Firestore for the given user */
async function loadCart(uid: string): Promise<CartItem[]> {
  const db = await getFirebaseDb();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.cart) ? (data.cart as CartItem[]) : [];
}

/** Persist cart to Firestore for the given user */
async function saveCart(uid: string, items: CartItem[]): Promise<void> {
  const db = await getFirebaseDb();
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, "users", uid), { cart: items });
}

/** Migrate old localStorage cart and remove it */
function migrateLocalStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem("cosy-loops-cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items: CartItem[] = parsed?.state?.items ?? [];
    localStorage.removeItem("cosy-loops-cart");
    return items;
  } catch {
    return [];
  }
}

/**
 * Hook that syncs the Zustand cart store with Firestore.
 * - On login: loads cart from Firestore (merges with any migrated localStorage items)
 * - On cart change: saves to Firestore (debounced)
 * - On logout: clears cart
 */
export function useCartSync() {
  const { user, loading: authLoading } = useAuth();
  const prevUid = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const skipNextSave = useRef(false);

  // Load cart from Firestore when user signs in
  useEffect(() => {
    if (authLoading) return;

    const uid = user?.uid ?? null;
    const store = useCartStore.getState();

    // User signed out
    if (!uid) {
      if (prevUid.current) {
        store.setItems([]);
        store.setHydrated(false);
      }
      prevUid.current = null;
      return;
    }

    // Same user, already hydrated
    if (uid === prevUid.current && store.hydrated) return;

    prevUid.current = uid;

    loadCart(uid)
      .then((remoteItems) => {
        const migrated = migrateLocalStorage();
        const merged = mergeCartItems(remoteItems, migrated);
        skipNextSave.current = true;
        store.setItems(merged);
        store.setHydrated(true);
        // Save merged cart if migration brought new items
        if (migrated.length > 0) {
          saveCart(uid, merged).catch((err) => console.warn("Cart sync failed:", err));
        }
      })
      .catch(() => {
        skipNextSave.current = true;
        store.setItems(migrateLocalStorage());
        store.setHydrated(true);
      });
  }, [user, authLoading]);

  // Save cart to Firestore whenever items change (debounced, after hydration)
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state, prev) => {
      if (state.items === prev.items) return;
      if (!state.hydrated) return;
      if (skipNextSave.current) {
        skipNextSave.current = false;
        return;
      }

      const uid = prevUid.current;
      if (!uid) return;

      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveCart(uid, state.items).catch((err) => console.warn("Cart sync failed:", err));
      }, 500);
    });

    return () => {
      unsubscribe();
      clearTimeout(saveTimer.current);
    };
  }, []);
}

/** Merge remote and local cart items, summing quantities for duplicates */
function mergeCartItems(
  remote: CartItem[],
  local: CartItem[]
): CartItem[] {
  if (local.length === 0) return remote;
  if (remote.length === 0) return local;
  const map = new Map<string, CartItem>();
  for (const item of remote) {
    map.set(item.productId, { ...item });
  }
  for (const item of local) {
    const existing = map.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(item.productId, { ...item });
    }
  }
  return Array.from(map.values());
}
