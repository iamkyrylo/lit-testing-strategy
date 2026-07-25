import type { Product, ProductInput } from "../types";
import { API_URL } from "./config";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  return response.json() as Promise<Product[]>;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (response.status === 404) {
    throw new Response("Product not found", { status: 404 });
  }

  return response.json() as Promise<Product>;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.json() as Promise<Product>;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.json() as Promise<Product>;
}
