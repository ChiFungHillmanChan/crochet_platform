"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import type { UserDoc } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDoc = useCallback(async (uid: string) => {
    const db = await getFirebaseDb();
    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      setUserDoc(snap.data() as UserDoc);
    } else {
      setUserDoc(null);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import("firebase/auth");

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          await fetchUserDoc(firebaseUser.uid);
        } else {
          setUserDoc(null);
        }
        setLoading(false);
      });
    })();
    return () => unsubscribe?.();
  }, [fetchUserDoc]);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = await getFirebaseAuth();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const auth = await getFirebaseAuth();
      const db = await getFirebaseDb();
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { doc, setDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        role: "customer",
        createdAt: serverTimestamp(),
      });
      await fetchUserDoc(cred.user.uid);
    },
    [fetchUserDoc]
  );

  const signInWithGoogleFn = useCallback(async () => {
    const auth = await getFirebaseAuth();
    const db = await getFirebaseDb();
    const { GoogleAuthProvider, signInWithPopup } = await import(
      "firebase/auth"
    );
    const { doc, getDoc, setDoc, serverTimestamp } = await import(
      "firebase/firestore"
    );
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Create user doc if first-time Google sign-in
    const snap = await getDoc(doc(db, "users", result.user.uid));
    if (!snap.exists()) {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase());
      const email = result.user.email ?? "";
      const role = adminEmails.includes(email.toLowerCase())
        ? "admin"
        : "customer";
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName ?? "",
        email,
        role,
        createdAt: serverTimestamp(),
      });
    }
    await fetchUserDoc(result.user.uid);
  }, [fetchUserDoc]);

  const signOutFn = useCallback(async () => {
    const auth = await getFirebaseAuth();
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
    setUserDoc(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        loading,
        signIn,
        signUp,
        signInWithGoogle: signInWithGoogleFn,
        signOut: signOutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
