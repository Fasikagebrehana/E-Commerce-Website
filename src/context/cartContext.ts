import { createContext, useContext } from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

export type CartContextValue = {
    items: CartItem[];
    count: number;
    subtotal: number;
    addItem: (product: Product, quantity?: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clear: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside <CartProvider>");
    return context;
};
