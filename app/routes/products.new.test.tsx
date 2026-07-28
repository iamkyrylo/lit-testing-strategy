import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { http, HttpResponse } from "msw";
import { apiUrl } from "../api/config";
import { test } from "../../test/context";
import ProductsNewRoute, { action } from "./products.new";

function renderWithRouteStub(initialEntries: string[]) {
  const Stub = createRoutesStub([
    { path: "/products/new", Component: ProductsNewRoute, action },
    { path: "/products", Component: () => <div>Products list</div> },
  ]);
  return render(<Stub initialEntries={initialEntries} />);
}

describe("/products/new route", () => {
  test("renders the add-product form", () => {
    renderWithRouteStub(["/products/new"]);
    expect(screen.getByRole("button", { name: "Create Product" })).toBeInTheDocument();
  });

  test("creates a product and redirects to the product list on valid submission", async () => {
    const user = userEvent.setup();

    renderWithRouteStub(["/products/new"]);

    await user.type(screen.getByLabelText("Name"), "New Widget");
    await user.type(screen.getByLabelText("SKU"), "NW-1");
    await user.type(screen.getByLabelText("Price"), "9");
    await user.type(screen.getByLabelText("Stock Quantity"), "5");
    await user.type(screen.getByLabelText("Category"), "Widgets");
    await user.type(screen.getByLabelText("Image URL"), "https://example.com/nw.png");
    await user.type(screen.getByLabelText("Description"), "Brand new widget");
    await user.click(screen.getByRole("button", { name: "Create Product" }));

    expect(await screen.findByText("Products list")).toBeInTheDocument();
  });

  test("re-renders the form with field errors on invalid submission", async () => {
    const user = userEvent.setup();

    renderWithRouteStub(["/products/new"]);

    await user.click(screen.getByRole("button", { name: "Create Product" }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  test("shows an alert when the create request fails", async ({ server }) => {
    server.use(
      http.post(apiUrl("/products"), () => HttpResponse.json({ message: "Boom" }, { status: 500 })),
    );
    const user = userEvent.setup();

    renderWithRouteStub(["/products/new"]);

    await user.type(screen.getByLabelText("Name"), "New Widget");
    await user.type(screen.getByLabelText("SKU"), "NW-1");
    await user.type(screen.getByLabelText("Price"), "9");
    await user.type(screen.getByLabelText("Stock Quantity"), "5");
    await user.type(screen.getByLabelText("Category"), "Widgets");
    await user.type(screen.getByLabelText("Image URL"), "https://example.com/nw.png");
    await user.type(screen.getByLabelText("Description"), "Brand new widget");
    await user.click(screen.getByRole("button", { name: "Create Product" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to create/i);
    expect(screen.getByRole("button", { name: "Create Product" })).toBeInTheDocument();
  });
});
