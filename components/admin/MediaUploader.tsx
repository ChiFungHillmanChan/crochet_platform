"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Plus, Film, Link2 } from "lucide-react";
import { uploadToR2 } from "@/lib/r2";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MediaUploaderProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  productSlug?: string;
}

function parseEmbedUrl(url: string): MediaItem | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      url,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`,
    };
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { type: "vimeo", url };
  }
  return null;
}

export function MediaUploader({
  media,
  onMediaChange,
  productSlug,
}: MediaUploaderProps) {
  const t = useTranslations("admin");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setUploading(true);
      const newItems: MediaItem[] = [];

      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
          toast.error(`${file.name} is not a supported file type`);
          continue;
        }
        try {
          const mediaType = isVideo ? "videos" : "images";
          const url = await uploadToR2(file, setProgress, {
            productSlug,
            mediaType,
          });
          newItems.push({ type: isVideo ? "video" : "image", url });
        } catch (err) {
          toast.error(
            `Failed to upload ${file.name}: ${err instanceof Error ? err.message : "Unknown error"}`
          );
        }
      }

      if (newItems.length) {
        onMediaChange([...media, ...newItems]);
      }
      setUploading(false);
      setProgress(0);
    },
    [media, onMediaChange, productSlug]
  );

  function addEmbed() {
    const item = parseEmbedUrl(embedUrl.trim());
    if (!item) {
      toast.error(t("invalidEmbed"));
      return;
    }
    onMediaChange([...media, item]);
    setEmbedUrl("");
    setShowEmbed(false);
  }

  function removeItem(index: number) {
    onMediaChange(media.filter((_, i) => i !== index));
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
        <p className="mb-2 text-sm text-warm-gray">{t("dragDropMedia")}</p>
        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="media-upload"
        />
        <label htmlFor="media-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            asChild
          >
            <span>{t("uploadMedia")}</span>
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

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => setShowEmbed(!showEmbed)}
        >
          <Link2 className="mr-1 h-4 w-4" />
          {t("addEmbed")}
        </Button>
      </div>

      {showEmbed && (
        <div className="flex gap-2">
          <Input
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            placeholder={t("embedUrl")}
            className="rounded-xl"
          />
          <Button
            type="button"
            size="sm"
            className="rounded-full"
            onClick={addEmbed}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {media.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {media.map((item, i) => (
            <div key={i} className="group relative">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-blush/30">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={`Media ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={`Media ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <Film className="h-8 w-8 text-warm-gray" />
                )}
              </div>
              <button
                type="button"
                onClick={() => removeItem(i)}
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
