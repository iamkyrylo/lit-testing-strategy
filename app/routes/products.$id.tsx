import { Suspense } from "react";
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
  Await,
  type LoaderFunctionArgs,
} from "react-router";
import { Alert, Box, Card, CardContent, Grid, Skeleton } from "@mui/material";
import type { Route } from "./+types/products.$id";
import { ProductDetails } from "../features/product-details/ProductDetails";
import { SalesChart } from "../features/sales-chart/SalesChart";
import { useSalesRangeParams } from "../features/sales-chart/useSalesRangeParams";
import { getProduct } from "../api/products";
import { getSales } from "../api/sales";
import { getDateRangeFromSearchParams } from "../utils/date";

export function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const product = getProduct(params.id);
  product.catch(() => {});

  const { from, to } = getDateRangeFromSearchParams(new URL(request.url).searchParams);
  const sales = getSales({ productId: params.id, from, to });

  return { product, sales, from, to };
}

export default function ProductDetailRoute({ loaderData }: Route.ComponentProps) {
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
                  variant="text"
                  width="60%"
                  height={80}
                  role="status"
                  aria-label="Loading product details"
                />
              }
            >
              <Await resolve={loaderData.product}>
                {(product) => (
                  <ProductDetails product={product} onEdit={() => navigate("edit")} />
                )}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense
              fallback={
                <Skeleton
                  variant="rectangular"
                  height={300}
                  role="status"
                  aria-label="Loading product sales"
                />
              }
            >
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
    </Grid>
  );
}

export function HydrateFallback() {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Box role="status" aria-label="Loading product details">
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="80%" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton
              variant="rectangular"
              height={300}
              role="status"
              aria-label="Loading product sales"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const is404 =
    (isRouteErrorResponse(error) && error.status === 404) ||
    (error instanceof Response && error.status === 404);

  if (is404) {
    return <Alert severity="error">Product not found.</Alert>;
  }

  return <Alert severity="error">Something went wrong.</Alert>;
}
