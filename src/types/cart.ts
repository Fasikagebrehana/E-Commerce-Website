export type CartItem = {
    id: number;
    title: string;
    thumbnail: string;
    // unit price after discount
    price: number;
    originalPrice: number;
    stock: number;
    quantity: number;
};
