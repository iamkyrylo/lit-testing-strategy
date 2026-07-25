import { apiUrl } from "./config";
import { toIsoDate } from "../utils/date";
import type { Sale } from "../types";

export interface GetSalesParams {
  productId?: string;
  from?: Date;
  to?: Date;
}

export async function getSales(params: GetSalesParams = {}): Promise<Sale[]> {
  const searchParams = new URLSearchParams();

  if (params.productId) {
    searchParams.set("productId", params.productId);
  }
  if (params.from) {
    searchParams.set("from", toIsoDate(params.from));
  }
  if (params.to) {
    searchParams.set("to", toIsoDate(params.to));
  }

  const query = searchParams.toString();
  const response = await fetch(apiUrl(`/sales${query ? `?${query}` : ""}`));

  return response.json() as Promise<Sale[]>;
}
