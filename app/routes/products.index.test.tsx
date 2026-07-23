import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsIndexRoute, { loader, HydrateFallback } from "./products.index";
import { test, describe, expect } from "../../test/context";

describe("/products index route", () => {
  test("renders the seeded products in the list once data resolves", async ({ schema }) => {
    const Stub = createRoutesStub([
      {
        path: "/products",
        Component: ProductsIndexRoute,
        loader,
        HydrateFallback,
      },
    ]);

    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stub initialEntries={["/products"]} />
      </LocalizationProvider>,
    );

    const [firstProduct] = schema.products.all().models;
    expect(await screen.findByText(firstProduct.name)).toBeInTheDocument();
  });
});
