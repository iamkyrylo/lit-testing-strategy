import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SalesChart, type SalesChartProps } from "./SalesChart";
import type { Sale } from "../../types";

function renderChart(props: Partial<SalesChartProps> = {}) {
  const defaultProps: SalesChartProps = {
    sales: [],
    from: new Date(2026, 0, 1),
    to: new Date(2026, 0, 31),
    onRangeChange: vi.fn(),
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
  it("plots one point per aggregated sales date", () => {
    const sales: Sale[] = [
      { id: "s1", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 10 },
      { id: "s2", date: "2026-01-06T00:00:00.000Z", productId: "p1", unitsSold: 15 },
    ];

    const { container } = renderChart({ sales });

    expect(getPlottedPointCount(container)).toBe(2);
  });

  it("aggregates multiple sales on the same date into a single plotted point", () => {
    const sales: Sale[] = [
      { id: "s1", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 10 },
      { id: "s2", date: "2026-01-05T00:00:00.000Z", productId: "p1", unitsSold: 5 },
    ];

    const { container } = renderChart({ sales });

    expect(getPlottedPointCount(container)).toBe(1);
  });

  it("calls onRangeChange with the new range when the date picker changes", () => {
    const onRangeChange = vi.fn();
    renderChart({ onRangeChange });

    const fromField = screen.getByLabelText(/^From$/, { selector: "input" });
    fireEvent.change(fromField, { target: { value: "02/15/2026" } });

    expect(onRangeChange).toHaveBeenCalledTimes(1);
    const [{ from, to }] = onRangeChange.mock.calls[0];
    expect(from.toDateString()).toBe(new Date(2026, 1, 15).toDateString());
    expect(to.toDateString()).toBe(new Date(2026, 0, 31).toDateString());
  });
});
