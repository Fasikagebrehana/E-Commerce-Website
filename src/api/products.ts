import client from "./client";
import type { Category, Product, ProductsResponse } from "../types/product";

export type ProductQuery = {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: "asc" | "desc";
};

export const getProducts = async (query: ProductQuery = {}): Promise<ProductsResponse> => {
    const response = await client.get("/products", { params: query });
    return response.data;
}

export const searchProducts = async (q: string, query: ProductQuery = {}): Promise<ProductsResponse> => {
    const response = await client.get("/products/search", { params: { q, ...query } });
    return response.data;
}

export const getProductsByCategory = async (slug: string, query: ProductQuery = {}): Promise<ProductsResponse> => {
    const response = await client.get(`/products/category/${slug}`, { params: query });
    return response.data;
}

export const getProductById = async (id: number): Promise<Product> => {
    const response = await client.get(`/products/${id}`);
    return response.data;
}

// the navbar and several pages all need the category list, so they share one request
let categoriesRequest: Promise<Category[]> | null = null;

export const getCategories = (): Promise<Category[]> => {
    if (!categoriesRequest) {
        categoriesRequest = client
            .get("/products/categories")
            .then((response) => response.data)
            .catch((err) => {
                categoriesRequest = null;
                throw err;
            });
    }
    return categoriesRequest;
}

// categories have no images, so use the first product thumbnail found in each one
export const getCategoryThumbnails = async (): Promise<Record<string, string>> => {
    const response = await client.get("/products", { params: { limit: 0, select: "category,thumbnail" } });
    const thumbnails: Record<string, string> = {};
    for (const product of response.data.products as Pick<Product, "category" | "thumbnail">[]) {
        thumbnails[product.category] ??= product.thumbnail;
    }
    return thumbnails;
}
