export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  description: string;
  status: "active" | "archived";
}

export type ProductInput = Omit<Product, "id">;
