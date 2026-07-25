import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
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
      <Typography id="sales-chart-heading" variant="h6" component="h2" gutterBottom hidden>
        Product Sales
      </Typography>
      <Box sx={{ mb: 2 }}>
        <DateRangePicker from={from} to={to} onChange={onRangeChange} />
      </Box>
      <Box aria-labelledby="sales-chart-heading" role="img">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="unitsSold" type="monotone" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
}

export interface SalesChartProps {
  sales: Sale[];
  from: Date;
  to: Date;
  onRangeChange: (range: { from: Date; to: Date }) => void;
}
