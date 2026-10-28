import { useEffect, useState, type ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { discountedPrice } from "../utils/price";
import { readStorage, writeStorage } from "../utils/storage";

const STORAGE_KEY = "cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => readStorage(STORAGE_KEY, []));

    useEffect(() => {
        writeStorage(STORAGE_KEY, items);
    }, [items]);

    const addItem = (product: Product, quantity = 1) => {
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) }
                        : item
                );
            }
            return [
                ...current,
                {
                    id: product.id,
                    title: product.title,
                    thumbnail: product.thumbnail,
                    price: discountedPrice(product),
                    originalPrice: product.price,
                    stock: product.stock,
                    quantity: Math.min(product.stock, quantity),
                },
            ];
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    const clear = () => setItems([]);

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext value={{ items, count, subtotal, addItem, updateQuantity, removeItem, clear }}>
            {children}
        </CartContext>
    );
};
