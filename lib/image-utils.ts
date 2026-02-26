import blurData from "@/lib/blur-data.json";

/**
 * Convert a product image path to an optimized WebP variant.
 *
 * Original:  /products/rainbow-hanging-planter.jpg
 * Thumbnail: /products/thumb/rainbow-hanging-planter.webp
 * Full:      /products/full/rainbow-hanging-planter.webp
 *
 * For R2-hosted images (https://...), returns the URL unchanged
 * since R2 images are already optimized on upload.
 */
export function getOptimizedImageUrl(
  src: string,
  variant: "thumb" | "full"
): string {
  if (!src.startsWith("/products/")) return src;

  const filename = src.split("/").pop();
  if (!filename) return src;

  const name = filename.replace(/\.(jpg|jpeg|png)$/i, "");
  // Cache-bust version — increment when images are re-processed
  return `/products/${variant}/${name}.webp?v=4`;
}

/**
 * Get a tiny inline blur placeholder for a product image.
 * Returns a ~100-byte base64 data URI for instant display while loading.
 */
export function getBlurDataUrl(src: string): string | undefined {
  if (!src.startsWith("/products/")) return undefined;

  const filename = src.split("/").pop();
  if (!filename) return undefined;

  const name = filename.replace(/\.(jpg|jpeg|png)$/i, "");
  return (blurData as Record<string, string>)[name];
}
