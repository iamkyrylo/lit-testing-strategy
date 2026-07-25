import { Suspense } from "react";
import { Await, useNavigate, type LoaderFunctionArgs } from "react-router";
import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import type { Route } from "./+types/products.index";
import { ProductList } from "../features/product-list/ProductList";
import { SalesChart } from "../features/sales-chart/SalesChart";
import { useSalesRangeParams } from "../features/sales-chart/useSalesRangeParams";
import { getProducts } from "../api/products";
import { getSales } from "../api/sales";
import { getDateRangeFromSearchParams } from "../utils/date";

export function loader({ request }: LoaderFunctionArgs) {
  const { from, to } = getDateRangeFromSearchParams(new URL(request.url).searchParams);

  return { products: getProducts(), sales: getSales({ from, to }), from, to };
}

export default function ProductsIndexRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const onRangeChange = useSalesRangeParams();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
              <Await resolve={loaderData.sales}>
                {(sales) => (
                  <SalesChart
                    sales={sales}
                    from={loaderData.from}
                    to={loaderData.to}
                    onRangeChange={onRangeChange}
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
