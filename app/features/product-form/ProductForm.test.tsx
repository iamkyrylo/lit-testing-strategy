import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { ProductForm, type ProductFormProps } from "./ProductForm";
import type { Product } from "../../types";

const sampleProduct: Product = {
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

function renderForm(props: Partial<ProductFormProps> = {}) {
  const defaultProps: ProductFormProps = { mode: "add", isSubmitting: false };
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => <ProductForm {...defaultProps} {...props} />,
    },
  ]);

  return render(<Stub initialEntries={["/"]} />);
}

describe("ProductForm", () => {
  it("renders empty fields in add mode", () => {
    renderForm({ mode: "add" });

    expect(screen.getByLabelText(/^name$/i)).toHaveValue("");
    expect(screen.getByLabelText(/sku/i)).toHaveValue("");
  });

  it("renders prefilled fields in edit mode", () => {
    renderForm({ mode: "edit", initialProduct: sampleProduct });

    expect(screen.getByLabelText(/^name$/i)).toHaveValue("Widget");
    expect(screen.getByLabelText(/sku/i)).toHaveValue("WID-1");
  });

  it("shows a field error message when errors are provided", () => {
    renderForm({ mode: "add", errors: { name: ["Name is required"] } });

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("disables the submit button and shows saving state while submitting", () => {
    renderForm({ mode: "add", isSubmitting: true });

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("shows create vs save labels depending on mode", () => {
    const { unmount } = renderForm({ mode: "add" });
    expect(screen.getByRole("button", { name: /create product/i })).toBeInTheDocument();
    unmount();

    renderForm({ mode: "edit", initialProduct: sampleProduct });
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
