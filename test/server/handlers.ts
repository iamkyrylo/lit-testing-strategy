import { http, HttpResponse } from "msw";
import { ModelAttrs, QueryOptions } from "miragejs-orm";
import { apiUrl } from "../../app/api/config";
import { SaleModel, TestCollections, testSchema } from "../mocks/schema";
import type { ProductInput } from "../../app/types";

export const handlers = [
  http.get(apiUrl("/products"), () => {
    const products = testSchema.products.all();
    return HttpResponse.json(products.toJSON());
  }),

  http.get(apiUrl("/products/:id"), ({ params }) => {
    const product = testSchema.products.find(String(params.id));

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return HttpResponse.json(product.toJSON());
  }),

  http.post(apiUrl("/products"), async ({ request }) => {
    const body = (await request.json()) as ProductInput;
    const product = testSchema.products.create(body);

    return HttpResponse.json(product.toJSON(), { status: 201 });
  }),

  http.put(apiUrl("/products/:id"), async ({ params, request }) => {
    const body = (await request.json()) as ProductInput;
    let product = testSchema.products.find(String(params.id));

    if (!product) {
      return HttpResponse.json({ message: "Product not found" }, { status: 404 });
    }

    product = product.update(body);

    return HttpResponse.json(product.toJSON());
  }),

  http.get(apiUrl("/sales"), ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const from = url.searchParams.get("from") ?? "0000-01-01";
    const to = url.searchParams.get("to") ?? "9999-12-31";

    const whereClause: QueryOptions<ModelAttrs<SaleModel, TestCollections>>["where"] = {
      date: { between: [from, to] },
    };
    if (productId) whereClause.productId = productId;

    const sales = testSchema.sales.findMany({ where: whereClause });
    return HttpResponse.json(sales.toJSON());
  }),
];
