import { redirect, useActionData } from "react-router";
import { createProduct } from "../api/products";
import { ProductForm } from "../features/product-form/ProductForm";
import { getFieldErrors, productSchema } from "../features/product-form/productSchema";
import { useProductFormStatus } from "../features/product-form/useProductFormStatus";
import type { Route } from "./+types/products.new";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = productSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { errors: getFieldErrors(result.error) };
  }

  try {
    await createProduct(result.data);
  } catch {
    return { apiError: "Failed to create the product. Please try again." };
  }

  return redirect("/products");
}

export default function ProductsNewRoute() {
  const status = useProductFormStatus();
  const actionData = useActionData<typeof action>();

  return (
    <ProductForm
      apiError={actionData?.apiError}
      errors={actionData?.errors}
      mode="add"
      status={status}
    />
  );
}
