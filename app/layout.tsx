import type { Metadata, Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

const SITE_URL = "https://cosyloops.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8C8DC",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cosy Loops | Handmade Crochet Toys & Gifts — UK",
    template: "%s | Cosy Loops",
  },
  description:
    "Adorable handmade crochet creations lovingly crafted in the UK. Shop unique crochet toys, amigurumi, and handmade gifts. Free UK delivery on orders over £30.",
  keywords: [
    "handmade crochet",
    "crochet toys UK",
    "amigurumi",
    "handmade gifts UK",
    "crochet animals",
    "handcrafted toys",
    "cosy loops",
    "baby gifts UK",
    "knitted toys",
    "crochet plushies",
  ],
  authors: [{ name: "Cosy Loops" }],
  creator: "Cosy Loops",
  publisher: "Cosy Loops",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Cosy Loops",
    title: "Cosy Loops | Handmade Crochet Toys & Gifts — UK",
    description:
      "Adorable handmade crochet creations lovingly crafted in the UK. Shop unique crochet toys, amigurumi, and handmade gifts.",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Cosy Loops — Handmade Crochet Creations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosy Loops | Handmade Crochet Toys & Gifts — UK",
    description:
      "Adorable handmade crochet creations lovingly crafted in the UK.",
    images: ["/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en/`,
      "zh-hk": `${SITE_URL}/zh-hk/`,
      "x-default": `${SITE_URL}/en/`,
    },
  },
  verification: {
    // ASSUMPTION: Add Google Search Console verification when available
    // google: "your-verification-code",
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${quicksand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Cosy Loops" />
        <meta name="apple-mobile-web-app-title" content="Cosy Loops" />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
