import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductDetailRoute, { loader, HydrateFallback, ErrorBoundary } from "./products.$id";
import { test, describe, expect } from "../../test/context";

function renderRoute(initialPath: string) {
  const Stub = createRoutesStub([
    {
      path: "/products/:id",
      Component: ProductDetailRoute,
      loader,
      HydrateFallback,
      ErrorBoundary,
    },
  ]);

  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stub initialEntries={[initialPath]} />
    </LocalizationProvider>,
  );
}

describe("/products/:id route", () => {
  test("renders the product's name and description once data resolves", async ({ schema }) => {
    const [product] = schema.products.all().models;

    renderRoute(`/products/${product.id}`);

    expect(await screen.findByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  test("renders the error boundary for an unknown product id", async () => {
    renderRoute("/products/does-not-exist");

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
