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
  test("returns every product in the store", async ({ schema }) => {
    schema.products.createMany(3);

    const expected = schema.products.all().toJSON();
    const products = await getProducts();

    expect(products).toEqual(expected);
  });
});

describe("getProduct", () => {
  test("returns the product matching the given id", async ({ schema }) => {
    schema.products.create();

    const seeded = schema.products.first();

    const product = await getProduct(seeded!.id);

    const expected = seeded!.toJSON();
    expect(product).toEqual(expected);
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

    const expected = stored?.toJSON();
    expect(created).toEqual(expected);
  });
});

describe("updateProduct", () => {
  test("updates the product to match the schema's record for it", async ({ schema }) => {
    schema.products.create();
    const seeded = schema.products.first();

    const updated = await updateProduct(seeded!.id, { ...productInput, name: "Renamed" });

    const stored = schema.products.find(seeded!.id);
    const expected = stored?.toJSON();
    expect(updated).toEqual(expected);
  });
});
