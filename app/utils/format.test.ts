import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a number as a dollar amount with two decimals", () => {
    expect(formatPrice(19.99)).toBe("$19.99");
    expect(formatPrice(5)).toBe("$5.00");
    expect(formatPrice(19.999)).toBe("$20.00");
  });
});
