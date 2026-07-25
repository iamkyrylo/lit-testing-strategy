import { test, describe, expect } from "../../test/context";
import { getSales } from "./sales";

describe("getSales", () => {
  test("returns sales for a specific product within a date range", async ({ schema }) => {
    const product = schema.products.create({
      name: "Test Product",
      sku: "TP-1",
      price: 9.99,
      stockQuantity: 5,
      category: "Test",
      imageUrl: "https://example.com/x.png",
      description: "desc",
      status: "active",
    });
    schema.sales.deleteMany({ where: { productId: product.id } });
    schema.sales.create({
      date: "2026-02-10T00:00:00.000Z",
      productId: product.id,
      unitsSold: 42,
    });
    schema.sales.create({
      date: "2026-05-01T00:00:00.000Z",
      productId: product.id,
      unitsSold: 7,
    });

    const sales = await getSales({
      productId: product.id,
      from: new Date("2026-02-01"),
      to: new Date("2026-02-28"),
    });

    expect(sales).toHaveLength(1);
    expect(sales[0].unitsSold).toBe(42);
  });

  test("returns sales across all products when no productId is given", async ({ schema }) => {
    const allSales = schema.sales.all().length;

    const sales = await getSales({
      from: new Date("0000-01-01"),
      to: new Date("9999-12-31"),
    });

    expect(sales).toHaveLength(allSales);
  });

  test("defaults to no filters when called with no params", async ({ schema }) => {
    const allSales = schema.sales.all().length;

    const sales = await getSales();

    expect(sales).toHaveLength(allSales);
  });
});
