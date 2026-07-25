import { useMemo, useState } from "react";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

const ROWS_PER_PAGE = 10;

type SortableColumn = "name" | "sku" | "price" | "stockQuantity" | "status";
type SortOrder = "asc" | "desc";

export interface ProductListProps {
  products: Product[];
  onSelect: (productId: string) => void;
  onAddProduct: () => void;
}

function sortProducts(products: Product[], column: SortableColumn, order: SortOrder): Product[] {
  const direction = order === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction;
    }

    return String(aValue).localeCompare(String(bValue)) * direction;
  });
}

export function ProductList({ products, onSelect, onAddProduct }: ProductListProps) {
  const [orderBy, setOrderBy] = useState<SortableColumn>("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(0);

  const sortedProducts = useMemo(
    () => sortProducts(products, orderBy, order),
    [products, orderBy, order],
  );
  const pageProducts = sortedProducts.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE,
  );

  function handleSort(column: SortableColumn) {
    if (orderBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
    setPage(0);
  }

  const columns: { key: SortableColumn; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price" },
    { key: "stockQuantity", label: "Stock" },
    { key: "status", label: "Status" },
  ];

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onAddProduct}>
          Add Product
        </Button>
      </Stack>

      {products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : "asc"}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProducts.map((product) => (
                <TableRow key={product.id} onClick={() => onSelect(product.id)} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>{product.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedProducts.length}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
          />
        </>
      )}
    </Stack>
  );
}
