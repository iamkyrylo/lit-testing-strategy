import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, Outlet } from "react-router";
import { ProductList, type ProductListProps } from "./ProductList";
import type { Product } from "../../types";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: "p1",
    name: "Widget",
    sku: "WID-1",
    price: 19.99,
    stockQuantity: 10,
    category: "Widgets",
    imageUrl: "https://example.com/widget.png",
    description: "A widget",
    status: "active",
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ id: "p1", name: "Widget", sku: "WID-1", price: 19.99, stockQuantity: 10 }),
  makeProduct({
    id: "p2",
    name: "Gadget",
    sku: "GAD-1",
    price: 29.99,
    stockQuantity: 0,
    status: "archived",
  }),
];

function renderProductList(props: Partial<ProductListProps> = {}) {
  const defaultProps: ProductListProps = { products, onAddProduct: vi.fn() };
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: Outlet,
      children: [
        { index: true, Component: () => <ProductList {...defaultProps} {...props} /> },
        { path: ":id", Component: () => <p>Product detail</p> },
      ],
    },
  ]);

  return render(<Stub initialEntries={["/products"]} />);
}

describe("ProductList", () => {
  it("renders a row for every product with its key fields", () => {
    renderProductList();

    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("WID-1")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
    expect(screen.getByText("GAD-1")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders the product name as a link to its detail page", () => {
    renderProductList();

    const link = screen.getByRole("link", { name: "Widget" });
    expect(link).toHaveAttribute("href", "/products/p1");
  });

  it("navigates to the product's detail page when its name link is clicked", async () => {
    const user = userEvent.setup();
    renderProductList();

    await user.click(screen.getByRole("link", { name: "Widget" }));

    expect(await screen.findByText("Product detail")).toBeInTheDocument();
  });

  it("calls onAddProduct when the Add Product button is clicked", async () => {
    const onAddProduct = vi.fn();
    const user = userEvent.setup();
    renderProductList({ onAddProduct });

    await user.click(screen.getByRole("button", { name: /add product/i }));

    expect(onAddProduct).toHaveBeenCalledTimes(1);
  });

  it("renders an empty state when there are no products", () => {
    renderProductList({ products: [] });

    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });

  it("sorts rows by a column when its header is clicked", async () => {
    const user = userEvent.setup();
    renderProductList();

    const rowsBefore = screen.getAllByRole("row").slice(1);
    expect(rowsBefore[0]).toHaveTextContent("Gadget");

    await user.click(screen.getByRole("button", { name: "Name" }));

    const rowsAfter = screen.getAllByRole("row").slice(1);
    expect(rowsAfter[0]).toHaveTextContent("Widget");
  });

  it("shows only 10 products per page and paginates the rest", () => {
    const manyProducts = Array.from({ length: 15 }, (_, i) =>
      makeProduct({ id: `p${i}`, name: `Product ${i}`, sku: `SKU-${i}` }),
    );

    renderProductList({ products: manyProducts });

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(10);
  });

  it("shows the next page of products when the next page button is clicked", async () => {
    const manyProducts = Array.from({ length: 15 }, (_, i) =>
      makeProduct({ id: `p${i}`, name: `Product ${String(i).padStart(2, "0")}`, sku: `SKU-${i}` }),
    );
    const user = userEvent.setup();

    renderProductList({ products: manyProducts });

    expect(screen.getByText("Product 00")).toBeInTheDocument();
    expect(screen.queryByText("Product 10")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(screen.getByText("Product 10")).toBeInTheDocument();
    expect(screen.queryByText("Product 00")).not.toBeInTheDocument();
  });
});
