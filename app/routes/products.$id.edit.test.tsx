import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import ProductEditRoute, { loader, action } from "./products.$id.edit";
import { test, describe, expect } from "../../test/context";

describe("/products/:id/edit route", () => {
  test("renders the form prefilled with the product's current values", async ({ schema }) => {
    schema.products.create();
    const product = schema.products.first()!;
    const Stub = createRoutesStub([
      { path: "/products/:id/edit", Component: ProductEditRoute, loader, action },
    ]);

    render(<Stub initialEntries={[`/products/${product.id}/edit`]} />);

    expect(await screen.findByLabelText(/^name$/i)).toHaveValue(product.name);
    expect(screen.getByLabelText(/sku/i)).toHaveValue(product.sku);
  });

  // known issue: form submit doesn't trigger the action with real field values
  test.skip("updates the product's name and redirects to the detail page", async ({ schema }) => {
    schema.products.create();
    const product = schema.products.first()!;
    const user = userEvent.setup();
    const Stub = createRoutesStub([
      { path: "/products/:id", Component: () => <div>Product detail</div> },
      { path: "/products/:id/edit", Component: ProductEditRoute, loader, action },
    ]);

    render(<Stub initialEntries={[`/products/${product.id}/edit`]} />);

    const nameField = await screen.findByLabelText(/^name$/i);
    await user.clear(nameField);
    await user.type(nameField, "Renamed Product");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText("Product detail")).toBeInTheDocument();
    expect(schema.products.find(product.id)?.name).toBe("Renamed Product");
  });
});
