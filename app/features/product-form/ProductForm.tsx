import { Form } from "react-router";
import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { Product } from "../../types";

export interface ProductFormProps {
  mode: "add" | "edit";
  initialProduct?: Product;
  errors?: Partial<Record<keyof Product, string[]>>;
  isSubmitting: boolean;
}

export function ProductForm({ mode, initialProduct, errors, isSubmitting }: ProductFormProps) {
  return (
    <Form method="post">
      <Stack spacing={2}>
        <TextField
          name="name"
          label="Name"
          defaultValue={initialProduct?.name ?? ""}
          error={Boolean(errors?.name)}
          helperText={errors?.name?.[0]}
        />
        <TextField
          name="sku"
          label="SKU"
          defaultValue={initialProduct?.sku ?? ""}
          error={Boolean(errors?.sku)}
          helperText={errors?.sku?.[0]}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          defaultValue={initialProduct?.price ?? ""}
          error={Boolean(errors?.price)}
          helperText={errors?.price?.[0]}
        />
        <TextField
          name="stockQuantity"
          label="Stock Quantity"
          type="number"
          defaultValue={initialProduct?.stockQuantity ?? ""}
          error={Boolean(errors?.stockQuantity)}
          helperText={errors?.stockQuantity?.[0]}
        />
        <TextField
          name="category"
          label="Category"
          defaultValue={initialProduct?.category ?? ""}
          error={Boolean(errors?.category)}
          helperText={errors?.category?.[0]}
        />
        <TextField
          name="imageUrl"
          label="Image URL"
          defaultValue={initialProduct?.imageUrl ?? ""}
          error={Boolean(errors?.imageUrl)}
          helperText={errors?.imageUrl?.[0]}
        />
        <TextField
          name="description"
          label="Description"
          multiline
          defaultValue={initialProduct?.description ?? ""}
          error={Boolean(errors?.description)}
          helperText={errors?.description?.[0]}
        />
        <FormControl>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            name="status"
            labelId="status-label"
            label="Status"
            defaultValue={initialProduct?.status ?? "active"}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "add" ? "Create Product" : "Save Changes"}
        </Button>
      </Stack>
    </Form>
  );
}
