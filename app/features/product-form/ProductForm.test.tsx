import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { test } from "../../../test/context";
import { ProductForm, type ProductFormProps } from "./ProductForm";

const defaultProps: ProductFormProps = { mode: "add", isSubmitting: false };
function renderProductForm(props: Partial<ProductFormProps> = {}) {
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
    renderProductForm({ mode: "add" });

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "SKU" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Price" })).toHaveValue("");
    expect(screen.getByRole("spinbutton", { name: "Stock Quantity" })).toHaveValue(null);
    expect(screen.getByRole("textbox", { name: "Category" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Image URL" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
  });

  test("renders prefilled fields in edit mode", ({ schema }) => {
    const product = schema.products.create();
    renderProductForm({ mode: "edit", initialProduct: product });

    expect(screen.getByLabelText("Name")).toHaveValue(product.name);
    expect(screen.getByLabelText("SKU")).toHaveValue(product.sku);
    expect(screen.getByLabelText("Price")).toHaveValue(product.price.toString());
  });

  it("shows a field error message when errors are provided", () => {
    renderProductForm({ mode: "add", errors: { name: ["Name is required"] } });
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("disables the submit button and shows saving state while submitting", () => {
    renderProductForm({ mode: "add", isSubmitting: true });
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });

  test("shows create vs save labels depending on mode", ({ schema }) => {
    const { unmount } = renderProductForm({ mode: "add" });
    expect(screen.getByRole("button", { name: "Create Product" })).toBeInTheDocument();
    unmount();

    const product = schema.products.create();
    renderProductForm({ mode: "edit", initialProduct: product });
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });
});
