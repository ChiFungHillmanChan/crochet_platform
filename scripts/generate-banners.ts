/**
 * Generate banner images using Gemini API.
 *
 * Usage: GEMINI_API_KEY=<key> pnpm tsx scripts/generate-banners.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const OUTPUT_DIR = join(process.cwd(), "public", "banners");
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const STYLE_KEYWORDS =
  "soft pastel, warm cosy handmade aesthetic, soft natural lighting, dreamy bokeh background, clean composition, generous negative space, photorealistic, high quality";

interface BannerConfig {
  filename: string;
  width: number;
  height: number;
  prompt: string;
}

const banners: BannerConfig[] = [
  {
    filename: "hero-banner-desktop.png",
    width: 1920,
    height: 800,
    prompt: `A ${STYLE_KEYWORDS} scene: soft pastel crochet yarn balls on a rustic wooden surface, soft pink #F8C8DC and blush #FFE4E1 tones, warm natural lighting, dreamy bokeh, generous negative space on the right side for text overlay. ${1920}x${800} composition.`,
  },
  {
    filename: "hero-banner-mobile.png",
    width: 768,
    height: 600,
    prompt: `A ${STYLE_KEYWORDS} scene: soft pastel crochet yarn balls on a rustic wooden surface, soft pink #F8C8DC and blush #FFE4E1 tones, warm natural lighting, dreamy bokeh, centered composition suitable for mobile. ${768}x${600} composition.`,
  },
  {
    filename: "collection-plushies.png",
    width: 800,
    height: 1000,
    prompt: `${STYLE_KEYWORDS}: Soft pink #F8C8DC background, scattered yarn balls and crochet hooks, warm cosy feeling, portrait orientation. ${800}x${1000} composition.`,
  },
  {
    filename: "collection-charms.png",
    width: 800,
    height: 1000,
    prompt: `${STYLE_KEYWORDS}: Lavender #E6D5F5 background, delicate flowers and ribbons, feminine craft aesthetic, portrait orientation. ${800}x${1000} composition.`,
  },
  {
    filename: "collection-home.png",
    width: 800,
    height: 1000,
    prompt: `${STYLE_KEYWORDS}: Mint #D4F0E7 background, cosy home scene with wooden elements, portrait orientation. ${800}x${1000} composition.`,
  },
  {
    filename: "shop-hero.png",
    width: 1920,
    height: 500,
    prompt: `${STYLE_KEYWORDS}: Pastel gradient background with yarn balls arranged in a line, soft blush to lavender transition, wide banner format. ${1920}x${500} composition.`,
  },
];

async function generateImage(config: BannerConfig): Promise<void> {
  console.log(`Generating ${config.filename}...`);

  const body = {
    contents: [
      {
        parts: [{ text: config.prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error for ${config.filename}: ${response.status} ${text}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error(`No content returned for ${config.filename}`);
  }

  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/")) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      const outputPath = join(OUTPUT_DIR, config.filename);
      writeFileSync(outputPath, buffer);
      console.log(`  Saved ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
      return;
    }
  }

  throw new Error(`No image data in response for ${config.filename}`);
}

async function main(): Promise<void> {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  for (const banner of banners) {
    try {
      await generateImage(banner);
    } catch (error) {
      console.error(`Failed to generate ${banner.filename}:`, error);
    }
  }

  console.log("\nDone!");
}

main();
