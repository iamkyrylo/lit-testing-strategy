import { useSearchParams } from "react-router";
import { toIsoDate } from "../../utils/date";

export function useSalesRangeParams() {
  const [, setSearchParams] = useSearchParams();

  return function onRangeChange({ from, to }: { from: Date; to: Date }) {
    setSearchParams({ from: toIsoDate(from), to: toIsoDate(to) });
  };
}
