"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductAccordionProps {
  description: string;
}

export function ProductAccordion({ description }: ProductAccordionProps) {
  const t = useTranslations("productPage");

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="details" className="border-blush">
        <AccordionTrigger className="text-base font-semibold text-cocoa hover:no-underline">
          {t("productDetails")}
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-warm-gray">
          {description}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="care" className="border-blush">
        <AccordionTrigger className="text-base font-semibold text-cocoa hover:no-underline">
          {t("careInstructions")}
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-warm-gray">
          {t("careText")}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping" className="border-blush">
        <AccordionTrigger className="text-base font-semibold text-cocoa hover:no-underline">
          {t("shippingReturns")}
        </AccordionTrigger>
        <AccordionContent className="text-sm leading-relaxed text-warm-gray">
          {t("shippingText")}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
