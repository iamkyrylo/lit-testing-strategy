import { render, screen, fireEvent } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

const defaultProps = {
  from: new Date(2026, 0, 1),
  to: new Date(2026, 0, 31),
  onChange: vi.fn(),
};
function renderPicker(props: Partial<DateRangePickerProps> = {}) {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker {...defaultProps} {...props} />
    </LocalizationProvider>,
  );
}

function getFieldInput(label: RegExp) {
  return screen.getByLabelText(label, { selector: "input" });
}

describe("DateRangePicker", () => {
  it("renders both a start and end date field with their current values", () => {
    renderPicker();

    expect(getFieldInput(/^From$/)).toHaveValue("01/01/2026");
    expect(getFieldInput(/^To$/)).toHaveValue("01/31/2026");
  });

  it("calls onChange with the new start date and unchanged end date", () => {
    renderPicker();

    fireEvent.change(getFieldInput(/^From$/), { target: { value: "02/15/2026" } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

    const [{ from, to }] = defaultProps.onChange.mock.calls[0];
    expect(from.toDateString()).toBe(new Date(2026, 1, 15).toDateString());
    expect(to.toDateString()).toBe(new Date(2026, 0, 31).toDateString());
  });

  it("calls onChange with the new end date and unchanged start date", () => {
    renderPicker();

    fireEvent.change(getFieldInput(/^To$/), { target: { value: "02/20/2026" } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

    const [{ from, to }] = defaultProps.onChange.mock.calls[0];
    expect(from.toDateString()).toBe(new Date(2026, 0, 1).toDateString());
    expect(to.toDateString()).toBe(new Date(2026, 1, 20).toDateString());
  });
});
