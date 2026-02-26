"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface CollectionCardProps {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

export function CollectionCard({
  title,
  href,
  imageSrc,
  imageAlt,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
          loading="lazy"
        />
      </div>
      <div className="bg-white px-4 py-3">
        <span className="font-heading text-base font-semibold text-cocoa underline decoration-soft-pink decoration-2 underline-offset-4 group-hover:decoration-cocoa">
          {title}
        </span>
      </div>
    </Link>
  );
}
