import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { test } from "../../test/context";
import ProductsLayout from "./products";
import ProductsIndexRoute, { loader, HydrateFallback } from "./products.index";

function renderWithRouteStub(initialEntries: string[]) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        { index: true, Component: ProductsIndexRoute, loader, HydrateFallback },
        { path: "new", Component: () => <div>New product dialog</div> },
        { path: ":id", Component: () => <div>Product details</div> },
      ],
    },
  ]);
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stub initialEntries={initialEntries} />
    </LocalizationProvider>,
  );
}

describe("/products index route", () => {
  test("renders the products in the list once data resolves", async ({ schema }) => {
    const products = schema.products.createMany(5);

    renderWithRouteStub(["/products"]);

    await screen.findByLabelText("Loading products");
    await screen.findByRole("table", { name: "Products" });

    expect(screen.getAllByRole("row").slice(1)).toHaveLength(products.length);
  });

  test("navigates to a product's detail page when its name link is clicked", async ({ schema }) => {
    const user = userEvent.setup();
    const product = schema.products.create();

    renderWithRouteStub(["/products"]);

    await screen.findByLabelText("Loading products");
    await screen.findByRole("table", { name: "Products" });

    await user.click(screen.getByRole("link", { name: product.name }));

    expect(await screen.findByText("Product details")).toBeInTheDocument();
  });

  test("navigates to the new-product dialog when Add Product is clicked", async () => {
    const user = userEvent.setup();

    renderWithRouteStub(["/products"]);

    await user.click(await screen.findByRole("button", { name: "Add Product" }));

    expect(await screen.findByText("New product dialog")).toBeInTheDocument();
  });
});
