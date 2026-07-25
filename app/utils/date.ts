export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DEFAULT_RANGE_DAYS = 30;

export function getDefaultDateRange(days: number = DEFAULT_RANGE_DAYS) {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

  return { from, to };
}

export function getDateRangeFromSearchParams(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return getDefaultDateRange();
  }

  return { from: new Date(from), to: new Date(to) };
}
