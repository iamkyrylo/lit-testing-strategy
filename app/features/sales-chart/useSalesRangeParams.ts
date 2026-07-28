import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toIsoDate } from "../../utils/date";
import { readFromStorage, writeToStorage } from "../../utils/storage";

const STORAGE_KEY = "sales-chart-date-range";

type StoredRange = Record<"from" | "to", string>;

export function useSalesRangeParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from") && searchParams.get("to")) {
      return;
    }

    const stored = readFromStorage<StoredRange>(STORAGE_KEY);

    if (stored) {
      setSearchParams(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once on mount to apply a stored range when the URL has none yet
  }, []);

  return function onRangeChange({ from, to }: { from: Date; to: Date }) {
    const range = { from: toIsoDate(from), to: toIsoDate(to) };
    writeToStorage(STORAGE_KEY, range);
    setSearchParams(range);
  };
}
