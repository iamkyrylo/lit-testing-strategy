import { describe, it, expect } from "vitest";
import { productSchema } from "./product-schema";

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
      expect(result.error.flatten().fieldErrors.name).toEqual(["Name is required"]);
    }
  });

  it("rejects a negative price", () => {
    const result = productSchema.safeParse({ ...validInput, price: "-5" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toEqual([
        "Price must be greater than 0",
      ]);
    }
  });

  it("rejects a negative stock quantity", () => {
    const result = productSchema.safeParse({ ...validInput, stockQuantity: "-1" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.stockQuantity).toEqual([
        "Stock quantity cannot be negative",
      ]);
    }
  });

  it("rejects an invalid image URL", () => {
    const result = productSchema.safeParse({ ...validInput, imageUrl: "not-a-url" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.imageUrl).toEqual(["Must be a valid URL"]);
    }
  });

  it("rejects a status outside active/archived", () => {
    const result = productSchema.safeParse({ ...validInput, status: "deleted" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.status).toBeDefined();
    }
  });
});
