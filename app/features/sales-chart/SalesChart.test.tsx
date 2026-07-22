import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SalesChart, type SalesChartProps } from "./SalesChart";
import { test, describe, expect } from "../../../test/context";
import type { Sale } from "../../types";

function renderChart(props: Partial<SalesChartProps> = {}) {
  const defaultProps: SalesChartProps = {
    initialSales: [],
    initialFrom: new Date(2026, 0, 1),
    initialTo: new Date(2026, 0, 31),
  };

  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <SalesChart {...defaultProps} {...props} />
    </LocalizationProvider>,
  );
}

function getPlottedPointCount(container: HTMLElement) {
  return container.querySelectorAll(".recharts-line-dot").length;
}

describe("SalesChart", () => {
  test("plots one point per aggregated sales date, without making a network request", () => {
    const initialSales: Sale[] = [
      { id: "s1", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 10 },
      { id: "s2", date: "2026-01-06T00:00:00.000Z", productId: "p1", unitsSold: 15 },
    ];

    const { container } = renderChart({ initialSales, productId: "p1" });

    expect(getPlottedPointCount(container)).toBe(2);
  });

  test("aggregates multiple sales on the same date into a single plotted point", () => {
    const initialSales: Sale[] = [
      { id: "s1", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 10 },
      { id: "s2", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 5 },
    ];

    const { container } = renderChart({ initialSales, productId: "p1" });

    expect(getPlottedPointCount(container)).toBe(1);
  });

  test("refetches sales for the newly selected date range when it changes", async ({
    schema,
  }) => {
    const product = schema.products.create({
      name: "Test Product",
      sku: "TP-1",
      price: 9.99,
      stockQuantity: 5,
      category: "Test",
      imageUrl: "https://example.com/x.png",
      description: "desc",
      status: "active",
    });
    schema.sales.deleteMany({ where: { productId: product.id } });
    schema.sales.create({
      date: "2026-02-10T00:00:00.000Z",
      productId: product.id,
      unitsSold: 42,
    });

    const { container } = renderChart({ initialSales: [], productId: product.id });
    expect(getPlottedPointCount(container)).toBe(0);

    const toField = screen.getByLabelText(/^To$/, { selector: "input" });
    fireEvent.change(toField, { target: { value: "02/28/2026" } });

    await waitFor(() => {
      expect(getPlottedPointCount(container)).toBe(1);
    });
  });
});
