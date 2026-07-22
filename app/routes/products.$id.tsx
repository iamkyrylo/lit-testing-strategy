import { useMemo } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/products.$id";
import { SalesChart } from "../features/sales-chart/SalesChart";
import type { Product, Sale } from "../types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const response = await fetch(`http://localhost/api/products/${params.id}`);

  if (response.status === 404) {
    throw new Response("Product not found", { status: 404 });
  }

  const product = (await response.json()) as Product;

  const salesResponse = await fetch(`http://localhost/api/sales?productId=${params.id}`);
  const sales = (await salesResponse.json()) as Sale[];

  return { product, sales };
}

export default function ProductDetailRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { product, sales } = loaderData;
  const { initialFrom, initialTo } = useMemo(() => {
    const now = new Date();
    return { initialFrom: new Date(now.getTime() - THIRTY_DAYS_MS), initialTo: now };
  }, []);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>SKU: {product.sku}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Stock: {product.stockQuantity}</p>
      <button onClick={() => navigate("edit")}>Edit</button>
      <SalesChart
        productId={product.id}
        initialSales={sales}
        initialFrom={initialFrom}
        initialTo={initialTo}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <p>Product not found.</p>;
  }

  return <p>Something went wrong.</p>;
}
