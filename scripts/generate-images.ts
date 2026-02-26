/**
 * Generate AI images using Gemini API.
 * Run with: npx tsx scripts/generate-images.ts
 * Requires GEMINI_API_KEY env var (loaded from .env).
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      value = value.replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set. Add it to .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const outputDir = resolve(process.cwd(), "public/generated");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const prompts = [
  {
    filename: "icon.png",
    prompt: `Create a simple, cute app icon for a handmade crochet e-commerce brand called "Cosy Loops".

Design requirements:
- A single adorable crocheted ball of yarn with a tiny crochet hook, forming a cosy round shape
- Soft pastel pink (#F8C8DC) as the main color, with hints of lavender (#E6D5F5) and mint green (#D4F0E7)
- Clean, minimal design — no text, no complex details
- Rounded, friendly shape that works well at small sizes (favicon)
- Solid white background
- Kawaii/cute illustration style with soft shadows
- Warm, inviting feel — like a handmade craft

The icon should be square, centered, with generous padding around the design.`,
  },
  {
    filename: "hero-bg.png",
    prompt: `Create a soft, dreamy background pattern for a handmade crochet e-commerce website called "Cosy Loops".

Design requirements:
- Very light and airy — mostly white/cream with gentle pastel accents
- Scattered tiny crochet elements: small yarn balls, tiny hearts, delicate flowers, little stars
- Colors: soft pink (#F8C8DC), blush (#FFE4E1), lavender (#E6D5F5), mint (#D4F0E7), light butter (#FFF3CD)
- Elements should be small, sparse, and spread out — not crowded
- Watercolor-style softness, slightly transparent/faded look
- No text, no large focal point — this is a subtle background
- Warm, cosy, handmade aesthetic
- The overall feeling should be like a gentle pastel confetti of tiny crochet motifs on a clean white canvas

This will be used as a hero banner background with text overlaid on top, so keep it very subtle and light.`,
  },
];

async function generateImage(prompt: string, filename: string) {
  console.log(`\nGenerating: ${filename}...`);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to generate ${filename}:`, error);
    return false;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;

  if (!parts) {
    console.error(`  No parts in response for ${filename}`);
    console.error(`  Response:`, JSON.stringify(data, null, 2).slice(0, 500));
    return false;
  }

  const imagePart = parts.find(
    (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
  );

  if (imagePart?.inlineData?.data) {
    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    const outPath = resolve(outputDir, filename);
    writeFileSync(outPath, buffer);
    console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return true;
  }

  const textPart = parts.find((p: { text?: string }) => p.text);
  if (textPart?.text) {
    console.error(`  Model returned text instead of image: ${textPart.text.slice(0, 200)}`);
  } else {
    console.error(`  No image data returned for ${filename}`);
  }
  return false;
}

async function main() {
  console.log("=== Generating Cosy Loops Images ===");
  console.log(`Model: ${MODEL}`);
  console.log(`Output: ${outputDir}\n`);

  let success = 0;
  for (const { filename, prompt } of prompts) {
    const ok = await generateImage(prompt, filename);
    if (ok) success++;
  }

  console.log(`\n=== Done: ${success}/${prompts.length} images generated ===`);
}

main().catch(console.error);
