"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { ShippingAddress } from "@/lib/types";

export interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  notes: string;
}

interface CheckoutDetailsFormProps {
  details: CheckoutDetails;
  processing: boolean;
  onChange: (details: CheckoutDetails) => void;
  onContinue: () => void;
}

export default function CheckoutDetailsForm({
  details,
  processing,
  onChange,
  onContinue,
}: CheckoutDetailsFormProps) {
  const t = useTranslations("checkout");

  function update(partial: Partial<CheckoutDetails>) {
    onChange({ ...details, ...partial });
  }

  function updateAddress(partial: Partial<ShippingAddress>) {
    onChange({
      ...details,
      shippingAddress: { ...details.shippingAddress, ...partial },
    });
  }

  return (
    <>
      <h2 className="font-heading text-lg font-semibold text-cocoa">
        {t("customerDetails")}
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            value={details.name}
            onChange={(e) => update({ name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={details.email}
            onChange={(e) => update({ email: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={details.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="font-heading text-sm font-semibold text-cocoa">
            {t("shippingAddress")}
          </h3>
          <div className="space-y-2">
            <Label htmlFor="line1">{t("addressLine1")}</Label>
            <Input
              id="line1"
              value={details.shippingAddress.line1}
              onChange={(e) => updateAddress({ line1: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2">{t("addressLine2")}</Label>
            <Input
              id="line2"
              value={details.shippingAddress.line2 ?? ""}
              onChange={(e) => updateAddress({ line2: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input
                id="city"
                value={details.shippingAddress.city}
                onChange={(e) => updateAddress({ city: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">{t("postcode")}</Label>
              <Input
                id="postcode"
                value={details.shippingAddress.postcode}
                onChange={(e) => updateAddress({ postcode: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="notes">{t("notes")}</Label>
          <Textarea
            id="notes"
            value={details.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder={t("notesPlaceholder")}
            className="rounded-xl"
            rows={3}
          />
        </div>
      </div>
      <Button
        onClick={onContinue}
        disabled={processing}
        className="w-full rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("processing")}
          </>
        ) : (
          t("continueToPayment")
        )}
      </Button>
    </>
  );
}
