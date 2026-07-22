import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductList } from "./ProductList";
import type { Product } from "../../types";

const products: Product[] = [
  {
    id: "p1",
    name: "Widget",
    sku: "WID-1",
    price: 19.99,
    stockQuantity: 10,
    category: "Widgets",
    imageUrl: "https://example.com/widget.png",
    description: "A widget",
    status: "active",
  },
  {
    id: "p2",
    name: "Gadget",
    sku: "GAD-1",
    price: 29.99,
    stockQuantity: 0,
    category: "Gadgets",
    imageUrl: "https://example.com/gadget.png",
    description: "A gadget",
    status: "archived",
  },
];

describe("ProductList", () => {
  it("renders a row for every product with its key fields", () => {
    render(<ProductList products={products} onSelect={vi.fn()} />);

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
    render(<ProductList products={products} onSelect={onSelect} />);

    await user.click(screen.getByText("Widget"));

    expect(onSelect).toHaveBeenCalledWith("p1");
  });

  it("renders an empty state when there are no products", () => {
    render(<ProductList products={[]} onSelect={vi.fn()} />);

    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });
});
