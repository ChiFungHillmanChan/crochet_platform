"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewSection } from "@/components/shop/ReviewSection";
import { getReviewsByProduct } from "@/lib/reviews";

interface ProductTabsProps {
  description: string;
  productId: string;
}

export function ProductTabs({ description, productId }: ProductTabsProps) {
  const t = useTranslations("productPage");
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    getReviewsByProduct(productId)
      .then((reviews) => setReviewCount(reviews.length))
      .catch(console.error);
  }, [productId]);

  return (
    <Tabs defaultValue="story" className="w-full">
      <TabsList className="w-full justify-start border-b border-blush bg-transparent">
        <TabsTrigger
          value="story"
          className="rounded-none border-b-2 border-transparent px-6 py-3 text-warm-gray data-[state=active]:border-soft-pink data-[state=active]:text-cocoa"
        >
          {t("ourStory")}
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent px-6 py-3 text-warm-gray data-[state=active]:border-soft-pink data-[state=active]:text-cocoa"
        >
          {t("reviews")} ({reviewCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="story" className="rounded-b-2xl bg-blush/20 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-4xl text-soft-pink/60">&ldquo;</span>
          <p className="font-heading text-lg leading-relaxed text-cocoa">
            {description}
          </p>
          <span className="text-4xl text-soft-pink/60">&rdquo;</span>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="rounded-b-2xl bg-blush/20 p-8">
        <ReviewSection productId={productId} />
      </TabsContent>
    </Tabs>
  );
}
