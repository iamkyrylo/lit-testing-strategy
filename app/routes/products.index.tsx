import { Suspense } from "react";
import { Await, useNavigate, type LoaderFunctionArgs } from "react-router";
import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import { getProducts } from "../api/products";
import { getSales } from "../api/sales";
import { ProductList } from "../features/product-list/ProductList";
import { SalesChart } from "../features/sales-chart/SalesChart";
import { useSalesRangeParams } from "../features/sales-chart/useSalesRangeParams";
import { getDateRangeFromSearchParams } from "../utils/date";
import type { Route } from "./+types/products.index";

export async function loader({ request }: LoaderFunctionArgs) {
  const products = await getProducts();

  const { from, to } = getDateRangeFromSearchParams(new URL(request.url).searchParams);
  const sales = getSales({ from, to });

  return { products, sales, from, to };
}

export default function ProductsIndexRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const onRangeChange = useSalesRangeParams();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense
              fallback={
                <Skeleton
                  aria-label="Loading product sales"
                  height={300}
                  role="status"
                  variant="rectangular"
                />
              }
            >
              <Await resolve={loaderData.sales}>
                {(sales) => (
                  <SalesChart
                    from={loaderData.from}
                    onRangeChange={onRangeChange}
                    sales={sales}
                    to={loaderData.to}
                  />
                )}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <ProductList onAddProduct={() => navigate("new")} products={loaderData.products} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function HydrateFallback() {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton
              aria-label="Loading product sales"
              height={300}
              role="status"
              variant="rectangular"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton
              aria-label="Loading products"
              height={400}
              role="status"
              variant="rectangular"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
