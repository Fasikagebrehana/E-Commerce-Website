import client from "./client";
import type { LoginResponse, User } from "../types/user";

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await client.post("/auth/login", { username, password, expiresInMins: 60 * 24 });
    return response.data;
}

export const getCurrentUser = async (token: string): Promise<User> => {
    const response = await client.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
}
