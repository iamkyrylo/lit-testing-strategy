import { http, HttpResponse } from "msw";
import { testSchema } from "../mocks/schema";
import type { Product } from "../../app/types";

type ProductInput = Omit<Product, "id">;

export const handlers = [
  http.get("http://localhost/api/products", () => {
    return HttpResponse.json(testSchema.products.all().toJSON());
  }),

  http.get("http://localhost/api/products/:id", ({ params }) => {
    const product = testSchema.products.find(String(params.id));

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product.toJSON());
  }),

  http.post("http://localhost/api/products", async ({ request }) => {
    const body = (await request.json()) as ProductInput;
    const created = testSchema.products.create(body);

    return HttpResponse.json(created.toJSON(), { status: 201 });
  }),

  http.put("http://localhost/api/products/:id", async ({ params, request }) => {
    const body = (await request.json()) as ProductInput;
    const existing = testSchema.products.find(String(params.id));

    if (!existing) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    existing.update(body);

    return HttpResponse.json(existing.toJSON());
  }),

  http.get("http://localhost/api/sales", ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const from = url.searchParams.get("from") ?? "0000-01-01";
    const to = url.searchParams.get("to") ?? "9999-12-31";

    const allSales = productId
      ? testSchema.sales.findMany({ where: { productId } })
      : testSchema.sales.all();

    const filtered = allSales.models.filter((sale) => sale.date >= from && sale.date <= to);

    return HttpResponse.json(filtered.map((sale) => sale.toJSON()));
  }),
];
