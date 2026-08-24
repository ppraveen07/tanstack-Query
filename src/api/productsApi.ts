import type { ProductsResponse } from "../types/Product";

const PRODUCTS_API = "https://dummyjson.com/products";

export const fetchProducts =
  async (): Promise<ProductsResponse> => {
    const response = await fetch(PRODUCTS_API);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  };