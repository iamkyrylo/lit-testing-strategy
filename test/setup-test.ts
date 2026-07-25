import "@testing-library/jest-dom/vitest";

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
