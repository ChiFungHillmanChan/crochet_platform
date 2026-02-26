import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-20">
      <div className="space-y-4 text-center">
        <h1 className="font-heading text-5xl font-bold text-soft-pink">404</h1>
        <h2 className="font-heading text-2xl text-cocoa">
          Oops! This page unravelled.
        </h2>
        <p className="text-warm-gray">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-soft-pink px-6 py-2 font-medium text-cocoa transition-colors hover:bg-soft-pink/80"
        >
          Back to Shop
        </Link>
      </div>
    </main>
  );
}
