import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsLayout from "./products";
import ProductsIndexRoute, { loader, HydrateFallback } from "./products.index";
import { test, describe, expect } from "../../test/context";
import type { Product } from "../types";

function renderRoute(siblings: object[] = []) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        { index: true, Component: ProductsIndexRoute, loader, HydrateFallback },
        ...siblings,
      ],
    },
  ]);

  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stub initialEntries={["/products"]} />
    </LocalizationProvider>,
  );
}

function firstVisibleProduct(products: Product[]): Product {
  return [...products].sort((a, b) => a.name.localeCompare(b.name))[0];
}

describe("/products index route", () => {
  test("renders the seeded products in the list once data resolves", async ({ schema }) => {
    renderRoute();

    const product = firstVisibleProduct(schema.products.all().models);
    expect(await screen.findByText(product.name)).toBeInTheDocument();
  });

  test("navigates to a product's detail page when its name link is clicked", async ({
    schema,
  }) => {
    const product = firstVisibleProduct(schema.products.all().models);
    const user = userEvent.setup();

    renderRoute([{ path: ":id", Component: () => <div>Product detail</div> }]);

    await user.click(await screen.findByRole("link", { name: product.name }));

    expect(await screen.findByText("Product detail")).toBeInTheDocument();
  });

  test("shows the next page of products when the next page button is clicked", async ({
    schema,
  }) => {
    const sortedProducts = [...schema.products.all().models].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    const firstPageProduct = sortedProducts[0];
    const secondPageProduct = sortedProducts[10];
    const user = userEvent.setup();

    renderRoute();

    expect(await screen.findByText(firstPageProduct.name)).toBeInTheDocument();
    expect(screen.queryByText(secondPageProduct.name)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(await screen.findByText(secondPageProduct.name)).toBeInTheDocument();
    expect(screen.queryByText(firstPageProduct.name)).not.toBeInTheDocument();
  });

  test("navigates to the new-product dialog when Add Product is clicked", async () => {
    const user = userEvent.setup();

    renderRoute([{ path: "new", Component: () => <div>New product dialog</div> }]);

    await user.click(await screen.findByRole("button", { name: /add product/i }));

    expect(await screen.findByText("New product dialog")).toBeInTheDocument();
  });
});
