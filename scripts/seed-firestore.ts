/**
 * Seed Firestore with real product categories and products.
 * Run with: npx tsx scripts/seed-firestore.ts
 * Requires FIREBASE_SERVICE_ACCOUNT env var (base64 encoded).
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  const sa = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString()
  );
  initializeApp({ credential: cert(sa) });
}

const db = getFirestore();

const categories = [
  { name: "Animals", slug: "animals", sortOrder: 1 },
  { name: "Accessories", slug: "accessories", sortOrder: 2 },
  { name: "Keychains", slug: "keychains", sortOrder: 3 },
];

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  categorySlug: string;
  images: string[];
}

const products: SeedProduct[] = [
  // ── Accessories ──
  {
    name: "Rainbow Hanging Planter",
    slug: "rainbow-hanging-planter",
    description:
      "A vibrant hand-crocheted hanging planter in rainbow colours. Perfect for small succulents or trailing plants.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/rainbow-hanging-planter.jpg"],
  },
  {
    name: "Pink Sunset Hanging Planter",
    slug: "pink-sunset-hanging-planter",
    description:
      "A gorgeous hanging planter in soft pink and sunset tones. Adds a warm touch to any room.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/pink-sunset-hanging-planter.jpg"],
  },
  {
    name: "Autumn Stripe Hanging Planter",
    slug: "autumn-stripe-hanging-planter",
    description:
      "A cosy hanging planter with autumn-inspired stripe pattern. Handmade with premium cotton yarn.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/autumn-stripe-hanging-planter.jpg"],
  },
  {
    name: "Lavender Velvet Scrunchie",
    slug: "lavender-velvet-scrunchie",
    description:
      "A soft hand-crocheted scrunchie in calming lavender. Gentle on hair and beautifully textured.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/lavender-velvet-scrunchie.jpg"],
  },
  {
    name: "Coral Velvet Scrunchie",
    slug: "coral-velvet-scrunchie",
    description:
      "A vibrant coral-coloured velvet scrunchie. Crocheted by hand for a unique, artisan look.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/coral-velvet-scrunchie.jpg"],
  },
  {
    name: "Festive Scrunchie — Red White & Blue",
    slug: "festive-scrunchie-red-white-blue",
    description:
      "A patriotic hand-crocheted scrunchie in red, white and blue. Perfect for celebrations and everyday wear.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: ["/products/festive-scrunchie-rwb.jpg"],
  },
  {
    name: "Cloud Friends AirPods Case Set",
    slug: "cloud-friends-airpods-case",
    description:
      "An adorable set of crocheted AirPods cases shaped like fluffy clouds. Protects your earbuds in style.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: [
      "/products/cloud-friends-airpods-case-1.jpg",
      "/products/cloud-friends-airpods-case-2.jpg",
    ],
  },
  {
    name: "Drawstring Pouch Collection",
    slug: "drawstring-pouch-collection",
    description:
      "A collection of versatile crocheted drawstring pouches in assorted colours. Great for gifts, jewellery, or small treasures.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: [
      "/products/drawstring-pouch-1.jpg",
      "/products/drawstring-pouch-2.jpg",
      "/products/drawstring-pouch-3.jpg",
      "/products/drawstring-pouch-4.jpg",
      "/products/drawstring-pouch-5.jpg",
    ],
  },
  {
    name: "Crochet Tote Bag — Sunset Stripe",
    slug: "crochet-tote-bag-sunset-stripe",
    description:
      "A stunning hand-crocheted tote bag with sunset-inspired stripes. Spacious and perfect for everyday use.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "accessories",
    images: [
      "/products/crochet-tote-bag-sunset-stripe-1.png",
      "/products/crochet-tote-bag-sunset-stripe-2.png",
      "/products/crochet-tote-bag-sunset-stripe-3.png",
    ],
  },
  // ── Keychains ──
  {
    name: "Christmas Bell Bag Charm",
    slug: "christmas-bell-bag-charm",
    description:
      "A festive crocheted bell bag charm that jingles with holiday cheer. A perfect stocking filler.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "keychains",
    images: ["/products/christmas-bell-bag-charm.jpg"],
  },
  {
    name: "Christmas Wreath Keyring",
    slug: "christmas-wreath-keyring",
    description:
      "A miniature crocheted Christmas wreath keyring. Tiny, detailed, and full of festive spirit.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "keychains",
    images: ["/products/christmas-wreath-keyring.jpg"],
  },
  {
    name: "Lily of the Valley Bag Charm",
    slug: "lily-of-the-valley-bag-charm",
    description:
      "A delicate crocheted lily of the valley bag charm. Elegant and beautifully detailed.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "keychains",
    images: ["/products/lily-of-the-valley-bag-charm.jpg"],
  },
  {
    name: "Chinese Lantern Bag Charm",
    slug: "chinese-lantern-bag-charm",
    description:
      "A lucky crocheted Chinese lantern bag charm in vibrant red and gold. Celebrates tradition with handmade craft.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "keychains",
    images: ["/products/chinese-lantern-bag-charm.jpg"],
  },
  // ── Animals ──
  {
    name: "Alice in Wonderland Bunny",
    slug: "alice-wonderland-bunny",
    description:
      "A whimsical crocheted bunny inspired by Alice in Wonderland. Complete with a tiny waistcoat and pocket watch.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "animals",
    images: [
      "/products/alice-wonderland-bunny-1.jpg",
      "/products/alice-wonderland-bunny-2.jpg",
    ],
  },
  {
    name: "Capybara with Sunflower",
    slug: "capybara-with-sunflower",
    description:
      "An irresistibly cute crocheted capybara holding a sunflower. The internet's favourite animal, now in yarn form.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "animals",
    images: [
      "/products/capybara-sunflower-1.jpg",
      "/products/capybara-sunflower-2.jpg",
    ],
  },
  {
    name: "Floppy Ear Bunny — Pink Hat",
    slug: "floppy-ear-bunny-pink-hat",
    description:
      "A sweet floppy-eared bunny wearing a cosy pink hat. Handmade with soft, child-safe yarn.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "animals",
    images: [
      "/products/floppy-ear-bunny-pink-hat-1.jpg",
      "/products/floppy-ear-bunny-pink-hat-2.png",
    ],
  },
  {
    name: "Floppy Ear Bunny — Green Overalls",
    slug: "floppy-ear-bunny-green-overalls",
    description:
      "An adorable floppy-eared bunny in tiny green overalls. Perfect gift for little ones or bunny collectors.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "animals",
    images: [
      "/products/floppy-ear-bunny-green-overalls-1.jpg",
      "/products/floppy-ear-bunny-green-overalls-2.jpg",
    ],
  },
  {
    name: "Mini Jellyfish Couple",
    slug: "mini-jellyfish-couple",
    description:
      "A pair of tiny crocheted jellyfish with flowing tentacles. Adorable as a desk ornament or hanging decoration.",
    price: 2000,
    stock: 5,
    isActive: true,
    categorySlug: "animals",
    images: ["/products/mini-jellyfish-couple.png"],
  },
];

async function seed() {
  console.log("Seeding categories...");
  for (const cat of categories) {
    await db.collection("categories").doc(cat.slug).set(cat);
    console.log(`  + ${cat.name}`);
  }

  console.log("Seeding products...");
  for (const product of products) {
    await db.collection("products").add({
      ...product,
      createdAt: new Date(),
    });
    console.log(`  + ${product.name}`);
  }

  console.log(
    "Done! Seeded %d categories and %d products.",
    categories.length,
    products.length
  );
}

seed().catch(console.error);
