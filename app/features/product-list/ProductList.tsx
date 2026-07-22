import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { Product } from "../../types";

export interface ProductListProps {
  products: Product[];
  onSelect: (productId: string) => void;
}

export function ProductList({ products, onSelect }: ProductListProps) {
  if (products.length === 0) {
    return <Typography>No products found.</Typography>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>SKU</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} onClick={() => onSelect(product.id)} hover>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.stockQuantity}</TableCell>
            <TableCell>{product.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
