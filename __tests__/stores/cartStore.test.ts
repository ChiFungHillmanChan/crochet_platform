import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cartStore";

function makeItem(overrides: Partial<{ productId: string; name: string; price: number; quantity: number; image: string }> = {}) {
  return {
    productId: "prod-1",
    name: "Test Product",
    price: 1999,
    quantity: 1,
    image: "/img.png",
    ...overrides,
  };
}

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds item to empty cart", () => {
    useCartStore.getState().addItem(makeItem());
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].productId).toBe("prod-1");
  });

  it("increments quantity for existing productId", () => {
    useCartStore.getState().addItem(makeItem({ quantity: 1 }));
    useCartStore.getState().addItem(makeItem({ quantity: 2 }));
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("removes item by productId", () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().removeItem("prod-1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates totalPrice with multiple items", () => {
    useCartStore.getState().addItem(makeItem({ productId: "a", price: 1000, quantity: 2 }));
    useCartStore.getState().addItem(makeItem({ productId: "b", price: 500, quantity: 3 }));
    // 1000*2 + 500*3 = 3500
    expect(useCartStore.getState().totalPrice()).toBe(3500);
  });

  it("clears all items", () => {
    useCartStore.getState().addItem(makeItem({ productId: "a" }));
    useCartStore.getState().addItem(makeItem({ productId: "b" }));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("updateQuantity to 0 removes item", () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity("prod-1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("totalItems sums quantities", () => {
    useCartStore.getState().addItem(makeItem({ productId: "a", quantity: 3 }));
    useCartStore.getState().addItem(makeItem({ productId: "b", quantity: 5 }));
    expect(useCartStore.getState().totalItems()).toBe(8);
  });
});
