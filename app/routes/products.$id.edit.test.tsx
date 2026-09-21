import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { http, HttpResponse } from "msw";
import { apiUrl } from "../api/config";
import { test } from "../../test/context";
import ProductEditRoute, { loader, action, HydrateFallback } from "./products.$id.edit";

function renderWithRouteStub(initialEntries: string[]) {
  const Stub = createRoutesStub([
    {
      path: "/products/:id/edit",
      Component: ProductEditRoute,
      loader,
      action,
      HydrateFallback,
    },
    { path: "/products/:id", Component: () => <div>Product details</div> },
  ]);
  return render(<Stub initialEntries={initialEntries} />);
}

describe("/products/:id/edit route", () => {
  test("renders the form prefilled with the product's current values", async ({ schema }) => {
    const product = schema.products.create();

    renderWithRouteStub([`/products/${product.id}/edit`]);

    await screen.findByRole("button", { name: "Save Changes" });

    expect(screen.getByLabelText("Name")).toHaveValue(product.name);
    expect(screen.getByLabelText("SKU")).toHaveValue(product.sku);
  });

  test("updates the product's name and redirects to the detail page", async ({ schema }) => {
    const user = userEvent.setup();
    const product = schema.products.create();

    renderWithRouteStub([`/products/${product.id}/edit`]);

    const formButton = await screen.findByRole("button", { name: "Save Changes" });

    const nameField = screen.getByLabelText("Name");
    await user.clear(nameField);
    await user.type(nameField, "Renamed Product");

    await user.click(formButton);

    expect(await screen.findByText("Product details")).toBeInTheDocument();
  });

  test("shows an alert when the save request fails", async ({ schema, server }) => {
    const user = userEvent.setup();
    const product = schema.products.create();
    server.use(
      http.put(apiUrl("/products/:id"), () =>
        HttpResponse.json({ message: "Boom" }, { status: 500 }),
      ),
    );

    renderWithRouteStub([`/products/${product.id}/edit`]);

    const formButton = await screen.findByRole("button", { name: "Save Changes" });
    await user.click(formButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to save/i);
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });
});
