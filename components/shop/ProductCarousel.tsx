"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

const AUTO_SCROLL_INTERVAL = 3000;

interface ProductCarouselProps {
  title: string;
  products: Product[];
  showRatings?: boolean;
}

export function ProductCarousel({
  title,
  products,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCardWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return 300;
    return (el.firstElementChild as HTMLElement).offsetWidth + 16; // card width + gap
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Auto-scroll: move one card to the left, loop back when at end
  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = getCardWidth();
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    if (atEnd) {
      // Loop back to start
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, [getCardWidth]);

  // Start auto-scroll
  useEffect(() => {
    if (products.length <= 1) return;

    autoScrollRef.current = setInterval(autoScroll, AUTO_SCROLL_INTERVAL);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [autoScroll, products.length]);

  // Pause auto-scroll on hover/touch, resume on leave
  const pauseAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const resumeAutoScroll = useCallback(() => {
    if (products.length <= 1) return;
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(autoScroll, AUTO_SCROLL_INTERVAL);
  }, [autoScroll, products.length]);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, products]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth();
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
    // Reset auto-scroll timer after manual click
    pauseAutoScroll();
    resumeAutoScroll();
  }

  if (products.length === 0) return null;

  return (
    <section className="py-[60px]" style={{ contentVisibility: "auto" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-cocoa sm:text-3xl">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full border border-blush p-2 text-cocoa transition-colors hover:bg-blush/20 disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full border border-blush p-2 text-cocoa transition-colors hover:bg-blush/20 disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
          onTouchStart={pauseAutoScroll}
          onTouchEnd={resumeAutoScroll}
          className="scrollbar-hide flex gap-4 overflow-x-hidden"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="w-[calc(50%-8px)] flex-shrink-0 md:w-[calc(25%-12px)]"
            >
              <ProductCard product={product} priority={i < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
