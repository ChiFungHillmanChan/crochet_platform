"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-blush/30">
        <span className="text-6xl">🧶</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setFullscreen(true)}
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-blush/30"
        >
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </button>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors",
                  i === selectedIndex
                    ? "border-soft-pink"
                    : "border-transparent hover:border-blush"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
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
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - Full size`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
