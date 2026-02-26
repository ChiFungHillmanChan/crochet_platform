import { routing } from "@/i18n/routing";

const SITE_URL = "https://cosyloops.com";

export function buildAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}

export function buildOpenGraph(
  locale: string,
  path: string,
  title: string,
  description: string
) {
  return {
    type: "website" as const,
    locale: locale === "en" ? "en_GB" : "zh_HK",
    url: `${SITE_URL}/${locale}${path}`,
    title,
    description,
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: "Cosy Loops — Handmade Crochet Creations",
      },
    ],
  };
}
