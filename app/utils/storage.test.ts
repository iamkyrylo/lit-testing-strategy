import { readFromStorage, writeToStorage } from "./storage";

describe("writeToStorage / readFromStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("round-trips a value written to storage", () => {
    writeToStorage("test-key", { from: "2026-01-01", to: "2026-01-31" });

    const value = readFromStorage<{ from: string; to: string }>("test-key");

    expect(value).toEqual({ from: "2026-01-01", to: "2026-01-31" });
  });

  it("returns null when the key does not exist", () => {
    expect(readFromStorage("missing-key")).toBeNull();
  });

  it("returns null when the stored value is not valid JSON", () => {
    window.localStorage.setItem("bad-key", "{not json");

    expect(readFromStorage("bad-key")).toBeNull();
  });
});
