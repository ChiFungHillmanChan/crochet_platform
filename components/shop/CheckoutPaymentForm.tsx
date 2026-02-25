"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

interface CheckoutPaymentFormProps {
  clientSecret: string;
  onBack: () => void;
}

function PaymentForm({ onBack }: { onBack: () => void }) {
  const t = useTranslations("checkout");
  const checkoutState = useCheckout();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = checkoutState.type === "loading";
  const isReady = checkoutState.type === "success";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (checkoutState.type !== "success") return;

      setSubmitting(true);
      setError(null);

      try {
        await checkoutState.checkout.confirm({
          returnUrl: window.location.href,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t("paymentFailed")
        );
        setSubmitting(false);
      }
    },
    [checkoutState, t]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-lg font-semibold text-cocoa">
          {t("paymentDetails")}
        </h2>
        <p className="text-sm text-warm-gray">{t("paymentSecure")}</p>
      </div>

      <div className="rounded-2xl border border-blush/30 bg-white p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-warm-gray" />
          </div>
        ) : (
          <PaymentElement />
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {checkoutState.type === "error" && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {checkoutState.error.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button
          type="submit"
          disabled={!isReady || submitting}
          className="flex-1 rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("processing")}
            </>
          ) : (
            t("payNow")
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="rounded-full"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToDetails")}
        </Button>
      </div>
    </form>
  );
}

export default function CheckoutPaymentForm({
  clientSecret,
  onBack,
}: CheckoutPaymentFormProps) {
  return (
    <CheckoutProvider
      stripe={getStripe()}
      options={{
        clientSecret,
        elementsOptions: {
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#e8b4b8",
              colorBackground: "#ffffff",
              colorText: "#5c4033",
              colorDanger: "#dc2626",
              fontFamily: "system-ui, sans-serif",
              borderRadius: "12px",
              spacingUnit: "4px",
            },
          },
        },
      }}
    >
      <PaymentForm onBack={onBack} />
    </CheckoutProvider>
  );
}
