type GtagEventParams = {
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
    item_category?: string;
  }>;
  [key: string]: unknown;
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function trackEvent(action: string, params?: GtagEventParams) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

export function trackViewProduct(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackEvent("view_item", {
    currency: "GBP",
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price / 100,
        quantity: 1,
        item_category: product.category,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackEvent("add_to_cart", {
    currency: "GBP",
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price / 100,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
}) {
  trackEvent("remove_from_cart", {
    currency: "GBP",
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price / 100,
        quantity: 1,
      },
    ],
  });
}

export function trackBeginCheckout(
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>
) {
  trackEvent("begin_checkout", {
    currency: "GBP",
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price / 100,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchase(order: {
  transactionId: string;
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  trackEvent("purchase", {
    transaction_id: order.transactionId,
    value: order.totalAmount / 100,
    currency: "GBP",
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price / 100,
      quantity: item.quantity,
    })),
  });
}
