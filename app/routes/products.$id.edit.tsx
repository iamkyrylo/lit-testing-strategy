import {
  redirect,
  useNavigation,
  useActionData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router";
import type { Route } from "./+types/products.$id.edit";
import { getProduct, updateProduct } from "../api/products";
import { ProductForm } from "../features/product-form/ProductForm";
import { getFieldErrors, productSchema } from "../features/product-form/productSchema";

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

  await updateProduct(params.id, result.data);

  return redirect(`/products/${params.id}`);
}

export default function ProductEditRoute({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <ProductForm
      errors={actionData?.errors}
      initialProduct={loaderData.product}
      isSubmitting={navigation.state === "submitting"}
      mode="edit"
    />
  );
}
