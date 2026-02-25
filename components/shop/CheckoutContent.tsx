"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function CheckoutContent() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [processing, setProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="space-y-4 text-center">
          <p className="text-lg text-warm-gray">{tc("empty")}</p>
          <Link href="/">
            <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
              {tc("continueShopping")}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  async function handleCheckout() {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your details");
      return;
    }

    setProcessing(true);
    try {
      const data = await apiPost<{ sessionId: string; url: string }>(
        "create-checkout-session",
        {
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          userId: user?.uid ?? "",
          customerName: name,
          customerEmail: email,
        },
        { requireAuth: false }
      );

      const stripe = await getStripe();
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 font-heading text-2xl font-bold text-cocoa">
        {t("title")}
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-lg font-semibold text-cocoa">
            {t("customerDetails")}
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-blush/20 p-6">
          <h2 className="font-heading text-lg font-semibold text-cocoa">
            {t("orderSummary")}
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg">
                      🧶
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-cocoa">{item.name}</p>
                  <p className="text-xs text-warm-gray">x{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-cocoa">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-cocoa">{tc("total")}</span>
            <span className="text-lg font-bold text-cocoa">
              {formatPrice(totalPrice())}
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
            size="lg"
          >
            {processing ? t("processing") : t("payNow")}
          </Button>
        </div>
      </div>
    </main>
  );
}
