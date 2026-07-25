import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box } from "@mui/material";
import { DateRangePicker } from "../../ui/date-range-picker/DateRangePicker";
import type { Sale } from "../../types";

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

export function SalesChart({ sales, from, to, onRangeChange }: SalesChartProps) {
  const chartData = aggregateByDate(sales);

  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <DateRangePicker from={from} to={to} onChange={onRangeChange} />
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" fill="#666" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="unitsSold" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface SalesChartProps {
  sales: Sale[];
  from: Date;
  to: Date;
  onRangeChange: (range: { from: Date; to: Date }) => void;
}
