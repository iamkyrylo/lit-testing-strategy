import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack } from "@mui/material";

export interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <Stack direction="row" spacing={2}>
      <DatePicker
        label="From"
        value={from}
        onChange={(newFrom) => {
          if (newFrom) {
            onChange({ from: newFrom, to });
          }
        }}
      />
      <DatePicker
        label="To"
        value={to}
        onChange={(newTo) => {
          if (newTo) {
            onChange({ from, to: newTo });
          }
        }}
      />
    </Stack>
  );
}
