import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductList } from "./ProductList";
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

describe("ProductList", () => {
  it("renders a row for every product with its key fields", () => {
    render(<ProductList products={products} onSelect={vi.fn()} onAddProduct={vi.fn()} />);

    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("WID-1")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
    expect(screen.getByText("GAD-1")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("calls onSelect with the product id when a row is clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ProductList products={products} onSelect={onSelect} onAddProduct={vi.fn()} />);

    await user.click(screen.getByText("Widget"));

    expect(onSelect).toHaveBeenCalledWith("p1");
  });

  it("calls onAddProduct when the Add Product button is clicked", async () => {
    const onAddProduct = vi.fn();
    const user = userEvent.setup();
    render(<ProductList products={products} onSelect={vi.fn()} onAddProduct={onAddProduct} />);

    await user.click(screen.getByRole("button", { name: /add product/i }));

    expect(onAddProduct).toHaveBeenCalledTimes(1);
  });

  it("renders an empty state when there are no products", () => {
    render(<ProductList products={[]} onSelect={vi.fn()} onAddProduct={vi.fn()} />);

    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });

  it("sorts rows by a column when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductList products={products} onSelect={vi.fn()} onAddProduct={vi.fn()} />);

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

    render(<ProductList products={manyProducts} onSelect={vi.fn()} onAddProduct={vi.fn()} />);

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(10);
  });
});
