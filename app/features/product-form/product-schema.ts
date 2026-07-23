import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stockQuantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function getFieldErrors(
  error: z.ZodError<ProductFormValues>,
): Partial<Record<keyof ProductFormValues, string[]>> {
  const tree = z.treeifyError(error);
  const fieldErrors: Partial<Record<keyof ProductFormValues, string[]>> = {};

  for (const [field, fieldTree] of Object.entries(tree.properties ?? {})) {
    fieldErrors[field as keyof ProductFormValues] = fieldTree?.errors;
  }

  return fieldErrors;
}
