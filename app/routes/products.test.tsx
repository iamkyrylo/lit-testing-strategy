import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import ProductsLayout from "./products";

function renderWithRouteStub(initialEntries: string[]) {
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
  return render(<Stub initialEntries={initialEntries} />);
}

describe("ProductsLayout", () => {
  it("does not render a back button on the list page", () => {
    renderWithRouteStub(["/products"]);

    expect(screen.queryByRole("button", { name: "Back to products list" })).not.toBeInTheDocument();
  });

  it("renders a back button on nested pages", () => {
    renderWithRouteStub(["/products/p1"]);

    expect(screen.getByRole("button", { name: "Back to products list" })).toBeInTheDocument();
  });

  it("navigates back to the list when the back button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouteStub(["/products/p1"]);

    await user.click(screen.getByRole("button", { name: "Back to products list" }));

    expect(await screen.findByText("Product list")).toBeInTheDocument();
  });
});
