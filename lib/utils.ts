import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price from pence to £X.XX */
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
