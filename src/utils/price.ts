import type { Product } from "../types/product";

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;

// dummyjson's `price` is the original price; the discount is applied on top of it
export const discountedPrice = (product: Pick<Product, "price" | "discountPercentage">) =>
    product.price * (1 - product.discountPercentage / 100);
