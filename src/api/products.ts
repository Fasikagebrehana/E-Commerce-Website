import client from "./client";

export const getProducts = async (limit?: number, skip?: number) => {
    const response = await client.get("/products", { params: { limit, skip } });
    return response.data;
}

export const getProductById = async (id: number) => {
    const response = await client.get(`/products/${id}`);
    return response.data;
}