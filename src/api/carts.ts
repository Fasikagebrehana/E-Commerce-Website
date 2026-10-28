import client from "./client";

// dummyjson simulates this: it returns the new cart but doesn't store it
export const createCart = async (userId: number, products: { id: number; quantity: number }[]): Promise<{ id: number }> => {
    const response = await client.post("/carts/add", { userId, products });
    return response.data;
}
