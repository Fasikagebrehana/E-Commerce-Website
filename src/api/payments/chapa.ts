import axios from "axios";
import type { AuthUser } from "../../types/user";

// our own backend (see backend/index.js), not dummyjson, so it gets its own instance
const payments = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export type PaymentStatus = {
    status: string;
    amount: number;
    currency: string;
};

export const initializePayment = async (
    items: { id: number; quantity: number }[],
    user: Pick<AuthUser, "email" | "firstName" | "lastName">
): Promise<{ checkoutUrl: string; txRef: string }> => {
    const response = await payments.post("/api/payments/initialize", {
        items,
        customer: { email: user.email, firstName: user.firstName, lastName: user.lastName },
    });
    return response.data;
}

export const verifyPayment = async (txRef: string): Promise<PaymentStatus> => {
    const response = await payments.get(`/api/payments/verify/${encodeURIComponent(txRef)}`);
    return response.data;
}
