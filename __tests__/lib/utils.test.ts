import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats 1999 pence as £19.99", () => {
    expect(formatPrice(1999)).toBe("£19.99");
  });

  it("formats 100 pence as £1.00", () => {
    expect(formatPrice(100)).toBe("£1.00");
  });

  it("formats 0 pence as £0.00", () => {
    expect(formatPrice(0)).toBe("£0.00");
  });

  it("formats 50 pence as £0.50", () => {
    expect(formatPrice(50)).toBe("£0.50");
  });
});
