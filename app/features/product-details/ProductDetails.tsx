import { Button, Typography } from "@mui/material";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

export function ProductDetails({ product, onEdit }: ProductDetailsProps) {
  return (
    <>
      <Typography variant="h4">{product.name}</Typography>
      <dl>
        <dt>Description</dt>
        <dd>{product.description}</dd>
        <dt>SKU</dt>
        <dd>{product.sku}</dd>
        <dt>Price</dt>
        <dd>{formatPrice(product.price)}</dd>
        <dt>Stock</dt>
        <dd>{product.stockQuantity}</dd>
      </dl>
      <Button variant="outlined" onClick={onEdit}>
        Edit
      </Button>
    </>
  );
}

export interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
}
