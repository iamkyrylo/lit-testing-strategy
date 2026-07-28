import { Form } from "react-router";
import {
  Alert,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { Product } from "../../types";

function getButtonLabel(mode: "add" | "edit", status: ProductFormStatus): string {
  switch (status) {
    case "submitting":
      return "Saving...";
    case "submitted":
      return mode === "add" ? "Created!" : "Saved!";
    default:
      return mode === "add" ? "Create Product" : "Save Changes";
  }
}

export function ProductForm({ apiError, errors, initialProduct, mode, status }: ProductFormProps) {
  return (
    <Form method="post">
      <Stack spacing={2}>
        {apiError && <Alert severity="error">{apiError}</Alert>}
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
        <Button type="submit" variant="contained" disabled={status !== "idle"}>
          {getButtonLabel(mode, status)}
        </Button>
      </Stack>
    </Form>
  );
}

export type ProductFormStatus = "idle" | "submitting" | "submitted";

export interface ProductFormProps {
  apiError?: string;
  errors?: Partial<Record<keyof Product, string[]>>;
  initialProduct?: Product;
  mode: "add" | "edit";
  status: ProductFormStatus;
}
