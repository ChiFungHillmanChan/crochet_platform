import type { Product } from "@/lib/types";

const SITE_URL = "https://cosyloops.com";

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cosy Loops",
    url: SITE_URL,
    description:
      "Adorable handmade crochet creations, lovingly crafted in the UK.",
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cosy Loops",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Adorable handmade crochet creations, lovingly crafted in the UK.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    sameAs: ["https://www.instagram.com/littleyinshop_/"],
  };
}

export function generateProductJsonLd(product: Product, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${SITE_URL}/${locale}/products/${product.slug}/`,
    brand: {
      "@type": "Brand",
      name: "Cosy Loops",
    },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "GBP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Cosy Loops",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GB",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "GB",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
      },
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateItemListJsonLd(
  products: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: p.url,
    })),
  };
}

export function generateFaqPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function generateCollectionPageJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cosy Loops Shop",
    description:
      "Browse our collection of adorable handmade crochet creations.",
    url: `${SITE_URL}/${locale}/`,
  };
}
