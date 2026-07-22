import "@testing-library/jest-dom/vitest";

// Recharts' ResponsiveContainer measures its container via getBoundingClientRect()
// to size its SVG. happy-dom has no layout engine, so every measurement is 0x0 and
// charts render nothing. This stubs a fixed size so chart tests can assert on real
// rendered output instead of mocking the chart component itself.
Element.prototype.getBoundingClientRect = () =>
  ({
    width: 400,
    height: 300,
    top: 0,
    left: 0,
    bottom: 300,
    right: 400,
    x: 0,
    y: 0,
    toJSON: () => {},
  }) as DOMRect;
