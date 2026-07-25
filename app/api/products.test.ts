import { test, describe, expect } from "../../test/context";
import { getProducts, getProduct, createProduct, updateProduct } from "./products";
import type { ProductInput } from "../types";

const productInput: ProductInput = {
  name: "Test Widget",
  sku: "TW-1",
  price: 9.99,
  stockQuantity: 5,
  category: "Test",
  imageUrl: "https://example.com/widget.png",
  description: "A widget for testing",
  status: "active",
};

describe("getProducts", () => {
  test("returns every seeded product", async ({ schema }) => {
    const products = await getProducts();

    expect(products).toEqual(schema.products.all().toJSON());
  });
});

describe("getProduct", () => {
  test("returns the product matching the given id", async ({ schema }) => {
    const [seeded] = schema.products.all().models;

    const product = await getProduct(seeded.id);

    expect(product).toEqual(seeded.toJSON());
  });

  test("throws a 404 Response for an unknown id", async () => {
    await expect(getProduct("does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});

describe("createProduct", () => {
  test("creates a product matching the schema's record for it", async ({ schema }) => {
    const created = await createProduct(productInput);

    const stored = schema.products.find(created.id);
    expect(stored).not.toBeNull();
    expect(created).toEqual(stored?.toJSON());
  });
});

describe("updateProduct", () => {
  test("updates the product to match the schema's record for it", async ({ schema }) => {
    const [seeded] = schema.products.all().models;

    const updated = await updateProduct(seeded.id, { ...productInput, name: "Renamed" });

    const stored = schema.products.find(seeded.id);
    expect(updated).toEqual(stored?.toJSON());
  });
});
