import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsLayout from "./products";
import ProductDetailRoute, { loader, HydrateFallback, ErrorBoundary } from "./products.$id";
import { test, describe, expect } from "../../test/context";

function renderRoute(initialPath: string, siblings: object[] = []) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        { path: ":id", Component: ProductDetailRoute, loader, HydrateFallback, ErrorBoundary },
        ...siblings,
      ],
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

  test("navigates to the edit dialog when Edit is clicked", async ({ schema }) => {
    const [product] = schema.products.all().models;
    const user = userEvent.setup();

    renderRoute(`/products/${product.id}`, [
      { path: ":id/edit", Component: () => <div>Edit dialog</div> },
    ]);

    await user.click(await screen.findByRole("button", { name: /edit/i }));

    expect(await screen.findByText("Edit dialog")).toBeInTheDocument();
  });
});
