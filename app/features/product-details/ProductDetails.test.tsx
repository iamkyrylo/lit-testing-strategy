import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProductDetails } from "./ProductDetails";
import type { Product } from "../../types";

const product: Product = {
  id: "p1",
  name: "Widget",
  sku: "WID-1",
  price: 19.99,
  stockQuantity: 10,
  category: "Widgets",
  imageUrl: "https://example.com/widget.png",
  description: "A widget",
  status: "active",
};

describe("ProductDetails", () => {
  it("renders the product's name, description, sku, price, and stock", () => {
    render(<ProductDetails product={product} onEdit={vi.fn()} />);

    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("A widget")).toBeInTheDocument();
    expect(screen.getByText("WID-1")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("calls onEdit when the Edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<ProductDetails product={product} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
