import { Suspense } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
  useAsyncError,
  Await,
  type LoaderFunctionArgs,
} from "react-router";
import { Alert, Button, Card, CardContent, Grid, Skeleton } from "@mui/material";
import type { Route } from "./+types/products.$id";
import { SalesChart } from "../features/sales-chart/SalesChart";
import type { Product, Sale } from "../types";

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const product = fetch(`http://localhost/api/products/${params.id}`).then((response) => {
    if (response.status === 404) {
      throw new Response("Product not found", { status: 404 });
    }
    return response.json() as Promise<Product>;
  });
  // Pre-register a handler so a 404 doesn't log as an unhandled rejection before
  // <Await> mounts and attaches its own - it still observes the same rejection.
  product.catch(() => {});

  const sales = fetch(`http://localhost/api/sales?productId=${params.id}`).then(
    (response) => response.json() as Promise<Sale[]>,
  );

  return { product, sales };
}

export function HydrateFallback() {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="80%" />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Scoped error UI for the product <Await>. A Response thrown inside a deferred
// loader promise reaches here as the raw Response, not the normalized
// ErrorResponseImpl that isRouteErrorResponse() checks for - so this checks
// `instanceof Response` directly rather than relying on that helper.
function ProductLoadError() {
  const error = useAsyncError();

  if (error instanceof Response && error.status === 404) {
    return <Alert severity="error">Product not found.</Alert>;
  }

  return <Alert severity="error">Something went wrong loading this product.</Alert>;
}

export default function ProductDetailRoute({ loaderData, params }: Route.ComponentProps) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton variant="text" width="60%" height={80} />}>
              <Await resolve={loaderData.product} errorElement={<ProductLoadError />}>
                {(product) => (
                  <>
                    <h2>{product.name}</h2>
                    <dl>
                      <dt>Description</dt>
                      <dd>{product.description}</dd>
                      <dt>SKU</dt>
                      <dd>{product.sku}</dd>
                      <dt>Price</dt>
                      <dd>${product.price.toFixed(2)}</dd>
                      <dt>Stock</dt>
                      <dd>{product.stockQuantity}</dd>
                    </dl>
                    <Button variant="outlined" onClick={() => navigate("edit")}>
                      Edit
                    </Button>
                  </>
                )}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
              <Await resolve={loaderData.sales}>
                {(sales) => <SalesChart productId={params.id} initialSales={sales} />}
              </Await>
            </Suspense>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Alert severity="error">Product not found.</Alert>;
  }

  return <Alert severity="error">Something went wrong.</Alert>;
}
