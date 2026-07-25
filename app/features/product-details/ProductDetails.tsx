import { Box, Button, Typography } from "@mui/material";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

export function ProductDetails({ product, onEdit }: ProductDetailsProps) {
  return (
    <>
      <Typography component="h2" color="primary" variant="h4">
        {product.name}
      </Typography>
      <Box
        aria-label="Product Details"
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          columnGap: 2,
          rowGap: 1,
        }}
      >
        <Typography component="dt" color="textSecondary">
          Description:
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.description}
        </Typography>
        <Typography component="dt" color="textSecondary">
          SKU:
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.sku}
        </Typography>
        <Typography component="dt" color="textSecondary">
          Price:
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {formatPrice(product.price)}
        </Typography>
        <Typography component="dt" color="textSecondary">
          Stock:
        </Typography>
        <Typography component="dd" sx={{ m: 0 }}>
          {product.stockQuantity}
        </Typography>
      </Box>
      <Button variant="outlined" onClick={onEdit} fullWidth>
        Edit
      </Button>
    </>
  );
}

export interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
}
