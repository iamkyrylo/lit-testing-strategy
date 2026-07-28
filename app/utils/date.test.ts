import { toIsoDate, getDefaultDateRange, getDateRangeFromSearchParams } from "./date";

describe("toIsoDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toIsoDate(new Date("2026-03-15T10:30:00.000Z"))).toBe("2026-03-15");
  });
});

describe("getDefaultDateRange", () => {
  it("returns a range ending now and starting the given number of days earlier", () => {
    const { from, to } = getDefaultDateRange(30);

    const diffInDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
    expect(diffInDays).toBeCloseTo(30, 1);
  });

  it("defaults to 30 days when no argument is given", () => {
    const { from, to } = getDefaultDateRange();

    const diffInDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
    expect(diffInDays).toBeCloseTo(30, 1);
  });
});

describe("getDateRangeFromSearchParams", () => {
  it("parses from/to when both are present", () => {
    const searchParams = new URLSearchParams({ from: "2026-01-01", to: "2026-01-31" });

    const { from, to } = getDateRangeFromSearchParams(searchParams);

    expect(toIsoDate(from)).toBe("2026-01-01");
    expect(toIsoDate(to)).toBe("2026-01-31");
  });

  it("falls back to the default range when from is missing", () => {
    const searchParams = new URLSearchParams({ to: "2026-01-31" });

    const { from, to } = getDateRangeFromSearchParams(searchParams);

    const diffInDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
    expect(diffInDays).toBeCloseTo(30, 1);
  });

  it("falls back to the default range when to is missing", () => {
    const searchParams = new URLSearchParams({ from: "2026-01-01" });

    const { from, to } = getDateRangeFromSearchParams(searchParams);

    const diffInDays = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
    expect(diffInDays).toBeCloseTo(30, 1);
  });
});
