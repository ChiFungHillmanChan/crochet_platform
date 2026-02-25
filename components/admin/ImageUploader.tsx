"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadToR2 } from "@/lib/r2";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        try {
          const url = await uploadToR2(file, setProgress);
          newUrls.push(url);
        } catch (err) {
          toast.error(
            `Failed to upload ${file.name}: ${err instanceof Error ? err.message : "Unknown error"}`
          );
        }
      }

      if (newUrls.length) {
        onImagesChange([...images, ...newUrls]);
      }
      setUploading(false);
      setProgress(0);
    },
    [images, onImagesChange]
  );

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blush p-8 transition-colors hover:border-soft-pink"
      >
        <Upload className="mb-2 h-8 w-8 text-warm-gray" />
        <p className="mb-2 text-sm text-warm-gray">
          Drag & drop images or click to browse
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            asChild
          >
            <span>Choose Files</span>
          </Button>
        </label>
        {uploading && (
          <div className="mt-4 w-full max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-blush">
              <div
                className="h-full rounded-full bg-soft-pink transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-warm-gray">
              {progress}%
            </p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="group relative">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                <Image
                  src={url}
                  alt={`Upload ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
