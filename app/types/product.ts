export interface Product {
  id: string;
  category: string;
  description: string;
  imageUrl: string;
  name: string;
  price: number;
  sku: string;
  status: "active" | "archived";
  stockQuantity: number;
}

export type ProductInput = Omit<Product, "id">;
