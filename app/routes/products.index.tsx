import { Suspense } from "react";
import { Await, useNavigate } from "react-router";
import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import type { Route } from "./+types/products.index";
import { ProductList } from "../features/product-list/ProductList";
import { SalesChart } from "../features/sales-chart/SalesChart";
import type { Product, Sale } from "../types";

export function loader() {
  const products = fetch("http://localhost/api/products").then(
    (response) => response.json() as Promise<Product[]>,
  );
  const sales = fetch("http://localhost/api/sales").then(
    (response) => response.json() as Promise<Sale[]>,
  );

  return { products, sales };
}

export function HydrateFallback() {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={400} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default function ProductsIndexRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
              <Await resolve={loaderData.sales}>
                {(sales) => <SalesChart initialSales={sales} />}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
              <Await resolve={loaderData.products}>
                {(products) => (
                  <ProductList
                    products={products}
                    onSelect={(id) => navigate(`/products/${id}`)}
                    onAddProduct={() => navigate("new")}
                  />
                )}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
