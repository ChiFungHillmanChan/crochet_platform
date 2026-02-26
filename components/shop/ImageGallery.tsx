"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { MediaPlayer } from "@/components/shop/MediaPlayer";
import type { MediaItem } from "@/lib/types";
import { Film } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  media?: MediaItem[];
}

function buildMediaList(images: string[], media?: MediaItem[]): MediaItem[] {
  if (media?.length) return media;
  return images.map((url) => ({ type: "image" as const, url }));
}

export function ImageGallery({ images, productName, media }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const items = buildMediaList(images, media);

  if (items.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-blush/30">
        <span className="text-6xl">🧶</span>
      </div>
    );
  }

  const current = items[selectedIndex];
  const isImage = current.type === "image";

  return (
    <>
      <div className="space-y-3">
        {isImage ? (
          <button
            onClick={() => setFullscreen(true)}
            className="relative aspect-square w-full overflow-hidden rounded-2xl bg-blush/30"
          >
            <Image
              src={getOptimizedImageUrl(current.url, "full")}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </button>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-blush/30">
            <MediaPlayer
              item={current}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        {items.length > 1 && (
          <div className="flex gap-2">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-2 transition-colors",
                  i === selectedIndex
                    ? "border-soft-pink"
                    : "border-transparent hover:border-blush"
                )}
              >
                {item.type === "image" ? (
                  <Image
                    src={getOptimizedImageUrl(item.url, "thumb")}
                    alt={`${productName} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={`${productName} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <Film className="h-6 w-6 text-warm-gray" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
          <VisuallyHidden>
            <DialogTitle>{productName}</DialogTitle>
          </VisuallyHidden>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            {isImage ? (
              <Image
                src={getOptimizedImageUrl(current.url, "full")}
                alt={`${productName} - Full size`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            ) : (
              <MediaPlayer
                item={current}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
