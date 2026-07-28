import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { test } from "../../test/context";
import ProductsLayout from "./products";
import ProductDetailRoute, { loader, HydrateFallback, ErrorBoundary } from "./products.$id";

function renderWithRouteStub(initialEntries: string[]) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        { path: ":id", Component: ProductDetailRoute, loader, HydrateFallback, ErrorBoundary },
        { path: ":id/edit", Component: () => <div>Edit dialog</div> },
      ],
    },
  ]);
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stub initialEntries={initialEntries} />
    </LocalizationProvider>,
  );
}

function getPlottedPointCount(container: HTMLElement) {
  return container.querySelectorAll(".recharts-line-dot").length;
}

describe("/products/:id route", () => {
  test("renders product details", async ({ schema }) => {
    const product = schema.products.create();

    renderWithRouteStub([`/products/${product.id}`]);

    await screen.findByLabelText("Loading product details");
    await screen.findByLabelText("Product Details");

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  test("renders product sales chart", async ({ schema }) => {
    const from = new Date("2026-01-01").toISOString();
    const to = new Date("2026-01-31").toISOString();

    const product = schema.products.create();
    schema.sales.create({
      date: new Date("2026-01-15").toISOString(),
      productId: product.id,
    });
    schema.sales.create({
      date: new Date("2026-01-16").toISOString(),
      productId: product.id,
    });

    const { container } = renderWithRouteStub([`/products/${product.id}?from=${from}&to=${to}`]);

    await screen.findByLabelText("Loading product sales");
    await screen.findByLabelText("Product Sales");

    expect(getPlottedPointCount(container)).toBe(2);
  });

  test("renders the error boundary for an unknown product id", async () => {
    renderWithRouteStub(["/products/does-not-exist"]);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  test("navigates to the edit dialog when Edit is clicked", async ({ schema }) => {
    const user = userEvent.setup();
    const product = schema.products.create();

    renderWithRouteStub([`/products/${product.id}`]);

    await user.click(await screen.findByRole("button", { name: "Edit" }));

    expect(await screen.findByText("Edit dialog")).toBeInTheDocument();
  });
});
