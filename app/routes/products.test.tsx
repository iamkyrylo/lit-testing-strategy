import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import ProductsLayout from "./products";

function renderLayout(initialPath: string) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: ProductsLayout,
      children: [
        { index: true, Component: () => <p>Product list</p> },
        { path: ":id", Component: () => <p>Product detail</p> },
      ],
    },
  ]);

  return render(<Stub initialEntries={[initialPath]} />);
}

describe("ProductsLayout", () => {
  it("does not render a back button on the list page", () => {
    renderLayout("/products");

    expect(screen.queryByRole("button", { name: /back to products list/i })).not.toBeInTheDocument();
  });

  it("renders a back button on nested pages", () => {
    renderLayout("/products/p1");

    expect(screen.getByRole("button", { name: /back to products list/i })).toBeInTheDocument();
  });

  it("navigates back to the list when the back button is clicked", async () => {
    const user = userEvent.setup();
    renderLayout("/products/p1");

    await user.click(screen.getByRole("button", { name: /back to products list/i }));

    expect(await screen.findByText("Product list")).toBeInTheDocument();
  });
});
