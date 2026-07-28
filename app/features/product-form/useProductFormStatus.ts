import { useNavigation } from "react-router";
import type { ProductFormStatus } from "./ProductForm";

export function useProductFormStatus(): ProductFormStatus {
  const navigation = useNavigation();

  if (navigation.state === "submitting") {
    return "submitting";
  }
  if (navigation.state === "loading" && navigation.formData != null) {
    return "submitted";
  }
  return "idle";
}
