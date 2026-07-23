const DEFAULT_RANGE_DAYS = 30;

export function getDefaultDateRange(days: number = DEFAULT_RANGE_DAYS) {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

  return { from, to };
}
