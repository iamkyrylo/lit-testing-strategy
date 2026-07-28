import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, Outlet } from "react-router";
import { Typography } from "@mui/material";
import { test } from "../../../test/context";
import { ProductList, type ProductListProps } from "./ProductList";
import { formatPrice } from "../../utils/format";

const defaultProps: ProductListProps = { products: [], onAddProduct: vi.fn() };
function renderProductList(props: Partial<ProductListProps> = {}) {
  const Stub = createRoutesStub([
    {
      path: "/products",
      Component: Outlet,
      children: [
        {
          index: true,
          Component: () => (
            <>
              <Typography id="products-heading" variant="h1">
                Products
              </Typography>
              <ProductList {...defaultProps} {...props} />
            </>
          ),
        },
        { path: ":id", Component: () => <p>Product details</p> },
      ],
    },
  ]);
  return render(<Stub initialEntries={["/products"]} />);
}

describe("ProductList", () => {
  test("renders a table with rows for each product with its key fields", ({ schema }) => {
    const products = schema.products.createMany(5).toJSON();

    renderProductList({ products });

    expect(screen.getByRole("table", { name: "Products" }));
    expect(screen.getAllByRole("row").slice(1)).toHaveLength(products.length);

    products.forEach((product) => {
      const row = within(screen.getByRole("row", { name: new RegExp(product.name) }));

      expect(row.getByRole("cell", { name: product.name })).toBeInTheDocument();
      expect(row.getByRole("link", { name: product.name })).toHaveAttribute(
        "href",
        `/products/${product.id}`,
      );
      expect(row.getByRole("cell", { name: product.sku })).toBeInTheDocument();
      expect(row.getByRole("cell", { name: formatPrice(product.price) })).toBeInTheDocument();
      expect(row.getByRole("cell", { name: String(product.stockQuantity) })).toBeInTheDocument();
      expect(row.getByRole("cell", { name: product.status })).toBeInTheDocument();
    });
  });

  test("navigates to the product's detail page when its name link is clicked", async ({
    schema,
  }) => {
    const user = userEvent.setup();
    const product = schema.products.create().toJSON();

    renderProductList({ products: [product] });

    await user.click(screen.getByRole("link", { name: product.name }));

    expect(await screen.findByText("Product details")).toBeInTheDocument();
  });

  test("sorts rows by a column when its header is clicked", async ({ schema }) => {
    const user = userEvent.setup();
    const products = schema.products
      .createMany([[{ name: "Gadget" }], [{ name: "Widget" }]])
      .toJSON();

    renderProductList({ products });

    const rowsBefore = screen.getAllByRole("row").slice(1);
    expect(rowsBefore[0]).toHaveTextContent("Gadget");

    await user.click(screen.getByRole("button", { name: "Name" }));

    const rowsAfter = screen.getAllByRole("row").slice(1);
    expect(rowsAfter[0]).toHaveTextContent("Widget");
  });

  test("shows only 10 products per page and paginates the rest", ({ schema }) => {
    const products = schema.products.createMany(11).toJSON();

    renderProductList({ products });

    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(10);
  });

  test("shows the next page of products when the next page button is clicked", async ({
    schema,
  }) => {
    const user = userEvent.setup();

    schema.products.createMany(10);
    const first = schema.products.create({ name: "A Product" });
    const last = schema.products.create({ name: "Z product" });
    const all = schema.products.all().toJSON();

    renderProductList({ products: all });

    expect(screen.getByText(first.name)).toBeInTheDocument();
    expect(screen.queryByText(last.name)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(screen.getByText(last.name)).toBeInTheDocument();
    expect(screen.queryByText(first.name)).not.toBeInTheDocument();
  });

  it("calls onAddProduct when the Add Product button is clicked", async () => {
    const user = userEvent.setup();

    renderProductList();

    await user.click(screen.getByRole("button", { name: "Add Product" }));

    expect(defaultProps.onAddProduct).toHaveBeenCalledTimes(1);
  });

  it("renders an empty state when there are no products", () => {
    renderProductList();
    expect(screen.getByText(/no products/i)).toBeInTheDocument();
  });
});
