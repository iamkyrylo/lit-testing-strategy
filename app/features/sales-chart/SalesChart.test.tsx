import { render, screen, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { test } from "../../../test/context";
import { SalesChart, type SalesChartProps } from "./SalesChart";

const defaultProps: SalesChartProps = {
  sales: [],
  from: new Date(2026, 0, 1),
  to: new Date(2026, 0, 31),
  onRangeChange: vi.fn(),
};
function renderSalesChart(props: Partial<SalesChartProps> = {}) {
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
  test("plots one point per aggregated sales date", ({ schema }) => {
    const sales = schema.sales.createMany(2).toJSON();
    const { container } = renderSalesChart({ sales });

    expect(getPlottedPointCount(container)).toBe(2);
  });

  test("aggregates multiple sales on the same date into a single plotted point", ({ schema }) => {
    const sales = schema.sales.createMany(2, { date: "2026-01-05T00:00:00.000Z" }).toJSON();
    const { container } = renderSalesChart({ sales });

    expect(getPlottedPointCount(container)).toBe(1);
  });

  test("calls onRangeChange with the new range when the date picker changes", () => {
    const onRangeChange = vi.fn();
    renderSalesChart({ onRangeChange });

    const fromField = screen.getByLabelText(/^From$/, { selector: "input" });
    fireEvent.change(fromField, { target: { value: "02/15/2026" } });

    expect(onRangeChange).toHaveBeenCalledTimes(1);
    const [{ from, to }] = onRangeChange.mock.calls[0];
    expect(from.toDateString()).toBe(new Date(2026, 1, 15).toDateString());
    expect(to.toDateString()).toBe(new Date(2026, 0, 31).toDateString());
  });
});
