import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { createCart } from "../api/carts";
import { formatPrice } from "../utils/price";
import { CartIcon, TrashIcon } from "../components/common/icons";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 4.99;

export default function Cart() {
    const { items, count, subtotal, updateQuantity, removeItem, clear } = useCart();
    const { user } = useAuth();
    const [placing, setPlacing] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [orderError, setOrderError] = useState("");

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const savings = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);

    const placeOrder = async () => {
        if (!user) return;
        setPlacing(true);
        setOrderError("");
        try {
            const cart = await createCart(user.id, items.map((item) => ({ id: item.id, quantity: item.quantity })));
            setOrderId(cart.id);
            clear();
        } catch {
            setOrderError("Couldn't place your order. Please try again.");
        } finally {
            setPlacing(false);
        }
    };

    if (orderId !== null) {
        return (
            <div className="mx-auto max-w-lg px-4 py-20 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div>
                <h1 className="mt-6 text-3xl font-semibold text-gray-900">Order placed!</h1>
                <p className="mt-2 text-gray-500">Thanks, {user?.firstName}. Your order number is #{orderId}.</p>
                <Link to="/products" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                    Continue shopping
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-lg px-4 py-20 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-400">
                    <CartIcon size={30} />
                </div>
                <h1 className="mt-6 text-3xl font-semibold text-gray-900">Your cart is empty</h1>
                <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
                <Link to="/products" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                    Start shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Shopping Cart</h1>
            <p className="mt-1 text-sm text-gray-500">{count} {count === 1 ? "item" : "items"}</p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
                <ul className="divide-y divide-gray-200 border-y border-gray-200">
                    {items.map((item) => (
                        <li key={item.id} className="flex gap-4 py-5">
                            <Link to={`/product/${item.id}`} className="h-24 w-24 shrink-0 rounded-lg bg-gray-50 sm:h-28 sm:w-28">
                                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain p-2" />
                            </Link>
                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex justify-between gap-4">
                                    <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:underline">{item.title}</Link>
                                    <span className="shrink-0 font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    {formatPrice(item.price)} each
                                    {item.originalPrice > item.price && (
                                        <span className="ml-2 text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                                    )}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-3">
                                    <div className="flex h-9 items-center rounded-md border border-gray-300">
                                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1} className="h-full px-3 disabled:text-gray-300" aria-label="Decrease quantity">−</button>
                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock} className="h-full px-3 disabled:text-gray-300" aria-label="Increase quantity">+</button>
                                    </div>
                                    <button type="button" onClick={() => removeItem(item.id)}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                                        <TrashIcon size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <aside className="h-fit rounded-xl bg-gray-50 p-6 lg:sticky lg:top-24">
                    <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                        {savings > 0 && (
                            <div className="flex justify-between text-emerald-700"><dt>You save</dt><dd>−{formatPrice(savings)}</dd></div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Shipping</dt>
                            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                        </div>
                        {shipping > 0 && (
                            <p className="text-xs text-gray-500">
                                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
                            </p>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                            <dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd>
                        </div>
                    </dl>

                    {user ? (
                        <button type="button" onClick={placeOrder} disabled={placing}
                            className="mt-6 h-12 w-full rounded-full bg-gray-900 font-medium text-white hover:bg-gray-700 disabled:bg-gray-400">
                            {placing ? "Placing order..." : "Place order"}
                        </button>
                    ) : (
                        <Link to="/login?redirect=/cart"
                            className="mt-6 grid h-12 w-full place-items-center rounded-full bg-gray-900 font-medium text-white hover:bg-gray-700">
                            Log in to check out
                        </Link>
                    )}
                    {orderError && <p className="mt-3 text-sm text-red-600">{orderError}</p>}
                    <Link to="/products" className="mt-4 block text-center text-sm text-gray-600 hover:text-gray-900">
                        Continue shopping
                    </Link>
                </aside>
            </div>
        </div>
    );
}
