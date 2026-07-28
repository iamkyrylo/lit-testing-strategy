import { redirect, useNavigation, useActionData } from "react-router";
import { createProduct } from "../api/products";
import { ProductForm } from "../features/product-form/ProductForm";
import { getFieldErrors, productSchema } from "../features/product-form/productSchema";
import type { Route } from "./+types/products.new";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const result = productSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { errors: getFieldErrors(result.error) };
  }

  await createProduct(result.data);

  return redirect("/products");
}

export default function ProductsNewRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <ProductForm
      errors={actionData?.errors}
      isSubmitting={navigation.state === "submitting"}
      mode="add"
    />
  );
}
