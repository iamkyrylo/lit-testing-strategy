import { Box, Button, Typography } from "@mui/material";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

export function ProductDetails({ product, onEdit }: ProductDetailsProps) {
  return (
    <>
      <Typography variant="h4" component="h2">
        {product.name}
      </Typography>
      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          columnGap: 2,
          rowGap: 1,
        }}
      >
        <Typography component="dt" color="text.secondary">
          Description
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.description}
        </Typography>
        <Typography component="dt" color="text.secondary">
          SKU
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.sku}
        </Typography>
        <Typography component="dt" color="text.secondary">
          Price
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {formatPrice(product.price)}
        </Typography>
        <Typography component="dt" color="text.secondary">
          Stock
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.stockQuantity}
        </Typography>
      </Box>
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
