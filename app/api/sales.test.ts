import { test, describe, expect } from "../../test/context";
import { getSales } from "./sales";

describe("getSales", () => {
  test("returns sales for a specific product within a date range", async ({ schema }) => {
    const product = schema.products.create();
    schema.sales.deleteMany({ where: { productId: product.id } });
    const inRange = schema.sales.create({
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

    const expected = [inRange.toJSON()];
    expect(sales).toEqual(expected);
  });

  test("returns sales across all products when no productId is given", async ({ schema }) => {
    const productA = schema.products.create();
    schema.sales.deleteMany({ where: { productId: productA.id } });
    const productB = schema.products.create();
    schema.sales.deleteMany({ where: { productId: productB.id } });
    schema.sales.create({
      date: "2026-03-01T00:00:00.000Z",
      productId: productA.id,
      unitsSold: 5,
    });
    schema.sales.create({
      date: "2026-03-02T00:00:00.000Z",
      productId: productB.id,
      unitsSold: 8,
    });

    const sales = await getSales({
      from: new Date("0000-01-01"),
      to: new Date("9999-12-31"),
    });

    const expected = schema.sales.all().toJSON();
    expect(sales).toEqual(expected);
  });

  test("defaults to no filters when called with no params", async ({ schema }) => {
    const product = schema.products.create();
    schema.sales.deleteMany({ where: { productId: product.id } });
    schema.sales.create({
      date: "2026-04-01T00:00:00.000Z",
      productId: product.id,
      unitsSold: 3,
    });

    const sales = await getSales();

    const expected = schema.sales.all().toJSON();
    expect(sales).toEqual(expected);
  });
});
