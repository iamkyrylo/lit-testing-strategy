import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRangePicker } from "../../ui/date-range-picker/DateRangePicker";
import type { Sale } from "../../types";

export interface SalesChartProps {
  productId?: string;
  initialSales: Sale[];
  initialFrom: Date;
  initialTo: Date;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function aggregateByDate(sales: Sale[]): { date: string; unitsSold: number }[] {
  const totals = new Map<string, number>();

  for (const sale of sales) {
    const date = sale.date.slice(0, 10);
    totals.set(date, (totals.get(date) ?? 0) + sale.unitsSold);
  }

  return Array.from(totals.entries())
    .map(([date, unitsSold]) => ({ date, unitsSold }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function SalesChart({ productId, initialSales, initialFrom, initialTo }: SalesChartProps) {
  const [range, setRange] = useState({ from: initialFrom, to: initialTo });
  const [sales, setSales] = useState(initialSales);

  async function handleRangeChange(newRange: { from: Date; to: Date }) {
    setRange(newRange);

    const params = new URLSearchParams({
      from: toIsoDate(newRange.from),
      to: toIsoDate(newRange.to),
    });

    if (productId) {
      params.set("productId", productId);
    }

    const response = await fetch(`http://localhost/api/sales?${params.toString()}`);
    const nextSales = (await response.json()) as Sale[];

    setSales(nextSales);
  }

  const chartData = aggregateByDate(sales);

  return (
    <div>
      <DateRangePicker from={range.from} to={range.to} onChange={handleRangeChange} />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="unitsSold" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
