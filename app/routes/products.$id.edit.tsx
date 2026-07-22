import {
  redirect,
  useNavigation,
  useActionData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import type { Route } from "./+types/products.$id.edit";
import { ProductForm } from "../features/product-form/ProductForm";
import { productSchema } from "../features/product-form/product-schema";
import type { Product } from "../types";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const response = await fetch(`http://localhost/api/products/${params.id}`);

  if (response.status === 404) {
    throw new Response("Product not found", { status: 404 });
  }

  const product = (await response.json()) as Product;

  return { product };
}

export async function action({ params, request }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response("Product not found", { status: 404 });
  }

  const formData = await request.formData();
  const result = productSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  await fetch(`http://localhost/api/products/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data),
  });

  return redirect(`/products/${params.id}`);
}

export default function ProductEditRoute({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <ProductForm
      mode="edit"
      initialProduct={loaderData.product}
      errors={actionData?.errors}
      isSubmitting={navigation.state === "submitting"}
    />
  );
}
