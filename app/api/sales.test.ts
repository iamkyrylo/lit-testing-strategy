import { test } from "../../test/context";
import { getSales } from "./sales";

describe("getSales", () => {
  test("returns sales across all products when no productId is given", async ({ schema }) => {
    schema.products.create("withSales");
    schema.products.create("withSales");

    const created = schema.sales.all().toJSON();
    const sales = await getSales();

    expect(sales).toEqual(created);
  });

  test("returns sales for a specific product", async ({ schema }) => {
    const product = schema.products.create();

    schema.sales.create({
      date: new Date("2026-02-01").toISOString(),
      productId: product.id,
      unitsSold: 42,
    });
    schema.sales.create({
      date: new Date("2026-02-27").toISOString(),
      productId: product.id,
      unitsSold: 7,
    });

    const created = product.reload().sales.toJSON();
    const sales = await getSales({
      productId: product.id,
      from: new Date("2026-02-01"),
      to: new Date("2026-02-28"),
    });

    expect(sales).toEqual(created);
  });
});
