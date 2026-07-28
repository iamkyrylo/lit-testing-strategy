import { http, HttpResponse } from "msw";
import { test } from "../../test/context";
import { apiUrl } from "./config";
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
    const created = schema.products.createMany(3).toJSON();
    const products = await getProducts();

    expect(products).toEqual(created);
  });
});

describe("getProduct", () => {
  test("returns the product matching the given id", async ({ schema }) => {
    const created = schema.products.create().toJSON();
    const product = await getProduct(created.id);

    expect(product).toEqual(created);
  });

  test("throws a 404 Response for an unknown id", async () => {
    await expect(getProduct("does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});

describe("createProduct", () => {
  test("creates a product matching the schema's record for it", async () => {
    const product = await createProduct(productInput);
    expect(product).toMatchObject(productInput);
  });

  test("throws a Response when the request fails", async ({ server }) => {
    server.use(
      http.post(apiUrl("/products"), () => HttpResponse.json({ message: "Boom" }, { status: 500 })),
    );

    await expect(createProduct(productInput)).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateProduct", () => {
  test("updates the product to match the schema's record for it", async ({ schema }) => {
    const created = schema.products.create();
    const product = await updateProduct(created.id, { ...productInput, name: "Renamed" });

    expect(product).toMatchObject({ id: created.id, name: "Renamed" });
  });

  test("throws a Response when the request fails", async ({ schema, server }) => {
    const created = schema.products.create();
    server.use(
      http.put(apiUrl("/products/:id"), () =>
        HttpResponse.json({ message: "Boom" }, { status: 500 }),
      ),
    );

    await expect(updateProduct(created.id, productInput)).rejects.toMatchObject({ status: 500 });
  });
});
