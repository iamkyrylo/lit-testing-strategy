import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test } from "../../../test/context";
import { formatPrice } from "../../utils/format";
import { ProductDetails } from "./ProductDetails";

describe("ProductDetails", () => {
  test("renders the product's name, description, sku, price, and stock", ({ schema }) => {
    const product = schema.products.create();

    render(<ProductDetails product={product} onEdit={vi.fn()} />);

    expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByLabelText("Product Details")).toBeInTheDocument();

    expect(screen.getByText("Description:")).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText("SKU:")).toBeInTheDocument();
    expect(screen.getByText(product.sku)).toBeInTheDocument();
    expect(screen.getByText("Price:")).toBeInTheDocument();
    expect(screen.getByText(formatPrice(product.price))).toBeInTheDocument();
    expect(screen.getByText("Stock:")).toBeInTheDocument();
    expect(screen.getByText(product.stockQuantity)).toBeInTheDocument();
  });

  test("calls onEdit when the Edit button is clicked", async ({ schema }) => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const product = schema.products.create();
    render(<ProductDetails product={product} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
