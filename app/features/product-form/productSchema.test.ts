import { describe, it, expect } from "vitest";
import { getFieldErrors, productSchema } from "./productSchema";

describe("productSchema", () => {
  const validInput = {
    name: "Widget",
    sku: "WID-1",
    price: "19.99",
    stockQuantity: "10",
    category: "Widgets",
    imageUrl: "https://example.com/widget.png",
    description: "A widget",
    status: "active",
  };

  it("accepts valid input and coerces price/stockQuantity to numbers", () => {
    const result = productSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(19.99);
      expect(result.data.stockQuantity).toBe(10);
    }
  });

  it("rejects an empty name", () => {
    const result = productSchema.safeParse({ ...validInput, name: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).name).toEqual(["Name is required"]);
    }
  });

  it("rejects a negative price", () => {
    const result = productSchema.safeParse({ ...validInput, price: "-5" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).price).toEqual(["Price must be greater than 0"]);
    }
  });

  it("rejects a negative stock quantity", () => {
    const result = productSchema.safeParse({ ...validInput, stockQuantity: "-1" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).stockQuantity).toEqual([
        "Stock quantity cannot be negative",
      ]);
    }
  });

  it("rejects an invalid image URL", () => {
    const result = productSchema.safeParse({ ...validInput, imageUrl: "not-a-url" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).imageUrl).toEqual(["Must be a valid URL"]);
    }
  });

  it("rejects a status outside active/archived", () => {
    const result = productSchema.safeParse({ ...validInput, status: "deleted" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFieldErrors(result.error).status).toBeDefined();
    }
  });
});
