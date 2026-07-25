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

    expect(products).toHaveLength(schema.products.all().length);
  });
});

describe("getProduct", () => {
  test("returns the product matching the given id", async ({ schema }) => {
    const [seeded] = schema.products.all().models;

    const product = await getProduct(seeded.id);

    expect(product.id).toBe(seeded.id);
    expect(product.name).toBe(seeded.name);
  });

  test("throws a 404 Response for an unknown id", async () => {
    await expect(getProduct("does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});

describe("createProduct", () => {
  test("creates a product and returns it with an id", async ({ schema }) => {
    const created = await createProduct(productInput);

    expect(created.id).toBeTruthy();
    expect(created.name).toBe(productInput.name);
    expect(schema.products.find(created.id)).not.toBeNull();
  });
});

describe("updateProduct", () => {
  test("updates the product's fields", async ({ schema }) => {
    const [seeded] = schema.products.all().models;

    const updated = await updateProduct(seeded.id, { ...productInput, name: "Renamed" });

    expect(updated.name).toBe("Renamed");
    expect(schema.products.find(seeded.id)?.name).toBe("Renamed");
  });
});
