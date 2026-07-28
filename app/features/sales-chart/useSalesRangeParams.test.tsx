import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, useSearchParams } from "react-router";
import { useSalesRangeParams } from "./useSalesRangeParams";

const STORAGE_KEY = "sales-chart-date-range";

function Component() {
  const onRangeChange = useSalesRangeParams();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <p>from: {searchParams.get("from") ?? "none"}</p>
      <p>to: {searchParams.get("to") ?? "none"}</p>
      <button
        onClick={() => onRangeChange({ from: new Date("2026-02-01"), to: new Date("2026-02-28") })}
      >
        Change range
      </button>
    </div>
  );
}

function renderComponent(initialPath: string) {
  const Stub = createRoutesStub([{ path: "/products", Component: Component }]);
  return render(<Stub initialEntries={[initialPath]} />);
}

describe("useSalesRangeParams", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("writes the new range to localStorage when onRangeChange is called", async () => {
    const user = userEvent.setup();

    renderComponent("/products");

    await user.click(screen.getByRole("button", { name: "Change range" }));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual({
      from: "2026-02-01",
      to: "2026-02-28",
    });
  });

  it("navigates the URL to a stored range on mount when the URL has none", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ from: "2026-01-01", to: "2026-01-31" }),
    );

    renderComponent("/products");

    await waitFor(() => {
      expect(screen.getByText("from: 2026-01-01")).toBeInTheDocument();
      expect(screen.getByText("to: 2026-01-31")).toBeInTheDocument();
    });
  });

  it("does not override the URL when it already has from/to", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ from: "2026-01-01", to: "2026-01-31" }),
    );

    renderComponent("/products?from=2026-05-01&to=2026-05-31");

    await waitFor(() => {
      expect(screen.getByText("from: 2026-05-01")).toBeInTheDocument();
      expect(screen.getByText("to: 2026-05-31")).toBeInTheDocument();
    });
  });
});
