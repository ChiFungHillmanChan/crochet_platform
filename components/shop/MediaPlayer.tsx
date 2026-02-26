"use client";

import type { MediaItem } from "@/lib/types";

interface MediaPlayerProps {
  item: MediaItem;
  className?: string;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] ?? null;
}

export function MediaPlayer({ item, className }: MediaPlayerProps) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        controls
        playsInline
        className={className}
        preload="metadata"
      />
    );
  }

  if (item.type === "youtube") {
    const videoId = extractYouTubeId(item.url);
    if (!videoId) return null;
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
      />
    );
  }

  if (item.type === "vimeo") {
    const videoId = extractVimeoId(item.url);
    if (!videoId) return null;
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        title="Vimeo video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className={className}
      />
    );
  }

  return null;
}
