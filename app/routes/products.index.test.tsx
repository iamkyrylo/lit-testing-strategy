import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsLayout from "./products";
import ProductsIndexRoute, { loader, HydrateFallback } from "./products.index";
import { test, describe, expect } from "../../test/context";

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

describe("/products index route", () => {
  test("renders the products in the list once data resolves", async ({ schema }) => {
    schema.products.create({ name: "Aardvark Widget" });

    renderRoute();

    expect(await screen.findByText("Aardvark Widget")).toBeInTheDocument();
  });

  test("navigates to a product's detail page when its name link is clicked", async ({
    schema,
  }) => {
    schema.products.create({ name: "Aardvark Widget" });
    const user = userEvent.setup();

    renderRoute([{ path: ":id", Component: () => <div>Product detail</div> }]);

    await user.click(await screen.findByRole("link", { name: "Aardvark Widget" }));

    expect(await screen.findByText("Product detail")).toBeInTheDocument();
  });

  test("shows the next page of products when the next page button is clicked", async ({
    schema,
  }) => {
    for (let i = 0; i < 11; i++) {
      schema.products.create({ name: `Product ${String(i).padStart(2, "0")}` });
    }
    const user = userEvent.setup();

    renderRoute();

    expect(await screen.findByText("Product 00")).toBeInTheDocument();
    expect(screen.queryByText("Product 10")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(await screen.findByText("Product 10")).toBeInTheDocument();
    expect(screen.queryByText("Product 00")).not.toBeInTheDocument();
  });

  test("navigates to the new-product dialog when Add Product is clicked", async () => {
    const user = userEvent.setup();

    renderRoute([{ path: "new", Component: () => <div>New product dialog</div> }]);

    await user.click(await screen.findByRole("button", { name: /add product/i }));

    expect(await screen.findByText("New product dialog")).toBeInTheDocument();
  });
});
