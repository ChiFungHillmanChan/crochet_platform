import { getFirebaseAuth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function getAuthToken(): Promise<string | null> {
  try {
    const auth = await getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

interface ApiOptions {
  requireAuth?: boolean;
}

export async function apiPost<T>(
  action: string,
  body: Record<string, unknown> = {},
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.requireAuth !== false) {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...body }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}
