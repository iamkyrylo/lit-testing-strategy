import { useMemo } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/products.index";
import { ProductList } from "../features/product-list/ProductList";
import { SalesChart } from "../features/sales-chart/SalesChart";
import type { Product, Sale } from "../types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function loader() {
  const [productsResponse, salesResponse] = await Promise.all([
    fetch("http://localhost/api/products"),
    fetch("http://localhost/api/sales"),
  ]);

  const products = (await productsResponse.json()) as Product[];
  const sales = (await salesResponse.json()) as Sale[];

  return { products, sales };
}

export default function ProductsIndexRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { products, sales } = loaderData;
  const { initialFrom, initialTo } = useMemo(() => {
    const now = new Date();
    return { initialFrom: new Date(now.getTime() - THIRTY_DAYS_MS), initialTo: now };
  }, []);

  return (
    <div>
      <button onClick={() => navigate("new")}>Add Product</button>
      <ProductList products={products} onSelect={(id) => navigate(`/products/${id}`)} />
      <SalesChart initialSales={sales} initialFrom={initialFrom} initialTo={initialTo} />
    </div>
  );
}
