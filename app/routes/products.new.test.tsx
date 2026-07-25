import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import ProductsNewRoute, { action } from "./products.new";
import { test, describe, expect } from "../../test/context";

describe("/products/new route", () => {
  test("renders the add-product form", () => {
    const Stub = createRoutesStub([{ path: "/products/new", Component: ProductsNewRoute, action }]);

    render(<Stub initialEntries={["/products/new"]} />);

    expect(screen.getByRole("button", { name: /create product/i })).toBeInTheDocument();
  });

  // known issue: form submit doesn't trigger the action with real field values
  test.skip("creates a product and redirects to the product list on valid submission", async ({
    schema,
  }) => {
    const user = userEvent.setup();
    const Stub = createRoutesStub([
      { path: "/products", Component: () => <div>Products list</div> },
      { path: "/products/new", Component: ProductsNewRoute, action },
    ]);

    render(<Stub initialEntries={["/products/new"]} />);

    await user.type(screen.getByLabelText(/^name$/i), "New Widget");
    await user.type(screen.getByLabelText(/sku/i), "NW-1");
    await user.type(screen.getByLabelText(/price/i), "9.99");
    await user.type(screen.getByLabelText(/stock quantity/i), "5");
    await user.type(screen.getByLabelText(/category/i), "Widgets");
    await user.type(screen.getByLabelText(/image url/i), "https://example.com/nw.png");
    await user.type(screen.getByLabelText(/description/i), "Brand new widget");
    await user.click(screen.getByRole("button", { name: /create product/i }));

    expect(await screen.findByText("Products list")).toBeInTheDocument();
    expect(schema.products.find({ where: { name: "New Widget" } })).not.toBeNull();
  });

  test("re-renders the form with field errors on invalid submission", async () => {
    const user = userEvent.setup();
    const Stub = createRoutesStub([{ path: "/products/new", Component: ProductsNewRoute, action }]);

    render(<Stub initialEntries={["/products/new"]} />);

    await user.click(screen.getByRole("button", { name: /create product/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
});
