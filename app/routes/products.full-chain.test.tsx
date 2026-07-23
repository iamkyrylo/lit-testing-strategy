import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsLayout from "./products";
import ProductsIndexRoute, {
  loader as indexLoader,
  HydrateFallback as IndexHydrateFallback,
} from "./products.index";
import ProductsNewRoute, { action as newAction } from "./products.new";
import ProductDetailRoute, {
  loader as detailLoader,
  HydrateFallback as DetailHydrateFallback,
  ErrorBoundary as DetailErrorBoundary,
} from "./products.$id";
import ProductEditRoute, { loader as editLoader, action as editAction } from "./products.$id.edit";
import { test, describe, expect } from "../../test/context";

function renderProductsApp(initialPath: string) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        {
          index: true,
          Component: ProductsIndexRoute,
          loader: indexLoader,
          HydrateFallback: IndexHydrateFallback,
        },
        { path: "new", Component: ProductsNewRoute, action: newAction },
        {
          path: ":id",
          Component: ProductDetailRoute,
          loader: detailLoader,
          HydrateFallback: DetailHydrateFallback,
          ErrorBoundary: DetailErrorBoundary,
        },
        {
          path: ":id/edit",
          Component: ProductEditRoute,
          loader: editLoader,
          action: editAction,
        },
      ],
    },
  ]);

  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stub initialEntries={[initialPath]} />
    </LocalizationProvider>,
  );
}

describe("products navigation, full chain", () => {
  test("navigates from the list to a product's detail page", async ({ schema }) => {
    const [product] = schema.products.all().models;
    const user = userEvent.setup();

    renderProductsApp("/products");

    await user.click(await screen.findByText(product.name));

    expect(await screen.findByText(product.description)).toBeInTheDocument();
  });

  test("navigates from the list to the new-product dialog", async () => {
    const user = userEvent.setup();

    renderProductsApp("/products");

    await user.click(await screen.findByRole("button", { name: /add product/i }));

    expect(await screen.findByRole("button", { name: /create product/i })).toBeInTheDocument();
  });

  test("navigates from a product's detail page to its edit dialog", async ({ schema }) => {
    const [product] = schema.products.all().models;
    const user = userEvent.setup();

    renderProductsApp(`/products/${product.id}`);

    await user.click(await screen.findByRole("button", { name: /edit/i }));

    expect(await screen.findByLabelText(/^name$/i)).toHaveValue(product.name);
  });

  test("shows the error boundary when navigating to an unknown product id", async () => {
    renderProductsApp("/products/does-not-exist");

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
