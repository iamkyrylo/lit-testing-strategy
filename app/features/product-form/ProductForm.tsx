import { Form } from "react-router";
import { Button, MenuItem, Select, Stack, TextField, InputLabel, FormControl } from "@mui/material";
import type { Product } from "../../types";

export function ProductForm({ mode, initialProduct, errors, isSubmitting }: ProductFormProps) {
  return (
    <Form method="post">
      <Stack spacing={2}>
        <TextField
          label="Name"
          name="name"
          defaultValue={initialProduct?.name ?? ""}
          error={Boolean(errors?.name)}
          helperText={errors?.name?.[0]}
        />
        <TextField
          label="SKU"
          name="sku"
          defaultValue={initialProduct?.sku ?? ""}
          error={Boolean(errors?.sku)}
          helperText={errors?.sku?.[0]}
        />
        <TextField
          label="Price"
          name="price"
          defaultValue={initialProduct?.price ?? ""}
          error={Boolean(errors?.price)}
          helperText={errors?.price?.[0]}
        />
        <TextField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          defaultValue={initialProduct?.stockQuantity ?? ""}
          error={Boolean(errors?.stockQuantity)}
          helperText={errors?.stockQuantity?.[0]}
        />
        <TextField
          label="Category"
          name="category"
          defaultValue={initialProduct?.category ?? ""}
          error={Boolean(errors?.category)}
          helperText={errors?.category?.[0]}
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          defaultValue={initialProduct?.imageUrl ?? ""}
          error={Boolean(errors?.imageUrl)}
          helperText={errors?.imageUrl?.[0]}
        />
        <TextField
          label="Description"
          name="description"
          defaultValue={initialProduct?.description ?? ""}
          error={Boolean(errors?.description)}
          helperText={errors?.description?.[0]}
          multiline
        />
        <FormControl>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            label="Status"
            labelId="status-label"
            name="status"
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

export interface ProductFormProps {
  mode: "add" | "edit";
  initialProduct?: Product;
  errors?: Partial<Record<keyof Product, string[]>>;
  isSubmitting: boolean;
}
