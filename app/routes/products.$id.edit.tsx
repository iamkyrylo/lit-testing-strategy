import {
  redirect,
  useActionData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import { Skeleton, Stack } from "@mui/material";
import { getProduct, updateProduct } from "../api/products";
import { ProductForm } from "../features/product-form/ProductForm";
import { getFieldErrors, productSchema } from "../features/product-form/productSchema";
import { useProductFormStatus } from "../features/product-form/useProductFormStatus";
import type { Route } from "./+types/products.$id.edit";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const product = await getProduct(params.id);

  return { product };
}

export async function action({ params, request }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const formData = await request.formData();
  const result = productSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { errors: getFieldErrors(result.error) };
  }

  try {
    await updateProduct(params.id, result.data);
  } catch {
    return { apiError: "Failed to save the product. Please try again." };
  }

  return redirect(`/products/${params.id}`);
}

export default function ProductEditRoute({ loaderData }: Route.ComponentProps) {
  const status = useProductFormStatus();
  const actionData = useActionData<typeof action>();

  return (
    <ProductForm
      apiError={actionData?.apiError}
      errors={actionData?.errors}
      initialProduct={loaderData.product}
      mode="edit"
      status={status}
    />
  );
}

export function HydrateFallback() {
  return (
    <Stack aria-label="Loading product form" role="status" spacing={2}>
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton height={56} key={index} variant="rounded" />
      ))}
      <Skeleton height={36} variant="rounded" />
    </Stack>
  );
}
