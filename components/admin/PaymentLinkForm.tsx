"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PRESET_PRICES = [1000, 1200, 2000, 2500, 3000]; // pence

interface PaymentLinkFormProps {
  onCreated: () => void;
}

export function PaymentLinkForm({ onCreated }: PaymentLinkFormProps) {
  const t = useTranslations("admin");
  const [productName, setProductName] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(2000);
  const [customPrice, setCustomPrice] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const amount = isCustom ? parseInt(customPrice) : selectedPrice;
    if (!productName.trim() || !amount || amount <= 0) {
      toast.error("Product name and valid price required");
      return;
    }

    setCreating(true);
    try {
      await apiPost("create-payment-link", { productName, amountPence: amount });
      setProductName("");
      setCustomPrice("");
      setIsCustom(false);
      setSelectedPrice(2000);
      onCreated();
      toast.success("Payment link created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-heading font-semibold text-cocoa">
        {t("createPaymentLink")}
      </h2>
      <div className="space-y-2">
        <Label>{t("productNameLabel")}</Label>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="rounded-xl"
          placeholder="e.g. Custom Amigurumi Bear"
        />
      </div>
      <div className="space-y-2">
        <Label>{t("price")}</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PRICES.map((p) => (
            <Button
              key={p}
              variant={!isCustom && selectedPrice === p ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => {
                setIsCustom(false);
                setSelectedPrice(p);
              }}
            >
              {formatPrice(p)}
            </Button>
          ))}
          <Button
            variant={isCustom ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => {
              setIsCustom(true);
              setSelectedPrice(null);
            }}
          >
            {t("customPrice")}
          </Button>
        </div>
        {isCustom && (
          <Input
            type="number"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder={t("priceLabel")}
            className="mt-2 w-40 rounded-xl"
          />
        )}
      </div>
      <Button
        onClick={handleCreate}
        disabled={creating}
        className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
      >
        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("createPaymentLink")}
      </Button>
    </div>
  );
}
