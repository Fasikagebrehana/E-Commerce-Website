import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../context/cartContext";
import type { Product } from "../types/product";
import { discountedPrice, formatPrice } from "../utils/price";
import ImageGallery from "../components/productDetails/ImageGallery";
import ProductTabs from "../components/productDetails/ProductTabs";
import StarRating from "../components/common/StarRating";
import ProductGrid from "../components/products/ProductGrid";
import { CartIcon, HeartIcon, ReturnIcon, ShieldIcon, TruckIcon } from "../components/common/icons";

const availabilityColor = (status: string) => {
    if (status === "In Stock") return "bg-emerald-50 text-emerald-700";
    if (status === "Low Stock") return "bg-amber-50 text-amber-700";
    return "bg-red-50 text-red-700";
};

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: product, loading, error } = useFetch(id ? `product|${id}` : null, () => getProductById(Number(id)));

    if (loading) {
        return (
            <div className="mx-auto grid max-w-7xl animate-pulse gap-10 px-4 py-8 lg:grid-cols-[1.4fr_1fr]">
                <div className="aspect-square rounded-xl bg-gray-100" />
                <div className="space-y-4">
                    <div className="h-8 w-3/4 rounded bg-gray-100" />
                    <div className="h-5 w-1/3 rounded bg-gray-100" />
                    <div className="h-8 w-1/4 rounded bg-gray-100" />
                    <div className="h-12 rounded bg-gray-100" />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-lg px-4 py-24 text-center">
                <h1 className="text-2xl font-semibold text-gray-900">We couldn't find this product</h1>
                <p className="mt-2 text-gray-500">It may have been removed, or the link is wrong.</p>
                <Link to="/products" className="mt-8 inline-block rounded-full bg-gray-900 px-7 py-3 font-medium text-white hover:bg-gray-700">
                    Browse products
                </Link>
            </div>
        );
    }

    // keyed by id so quantity and wishlist state reset when moving to another product
    return <ProductView key={product.id} product={product} />;
}

const ProductView = ({ product }: { product: Product }) => {
    const { addItem, items } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const related = useFetch(`related|${product.category}`, () => getProductsByCategory(product.category, { limit: 5 }));

    const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
    // the cart caps each item at the available stock
    const maxQuantity = Math.max(0, product.stock - inCart);
    const hasDiscount = product.discountPercentage >= 1;
    const outOfStock = product.stock === 0;
    const relatedProducts = related.data?.products.filter((p) => p.id !== product.id).slice(0, 4);
    const categoryName = product.category.replace(/-/g, " ");

    const handleAddToCart = () => {
        addItem(product, quantity);
        setQuantity(1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 text-gray-800">
            <nav className="mb-8 truncate text-sm text-gray-400">
                <Link to="/" className="hover:text-gray-600">Home</Link>
                <span className="mx-1">/</span>
                <Link to={`/category/${product.category}`} className="capitalize hover:text-gray-600">{categoryName}</Link>
                <span className="mx-1">/</span>
                <span className="text-gray-800">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                <ImageGallery images={product.images} title={product.title} />

                <div>
                    {product.brand && (
                        <p className="mb-1 text-sm uppercase tracking-wide text-gray-400">{product.brand}</p>
                    )}
                    <h1 className="text-3xl font-medium tracking-tight">{product.title}</h1>

                    <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={product.rating} />
                        <span className="text-gray-500">
                            {product.rating.toFixed(1)} ({product.reviews.length} reviews)
                        </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-semibold">{formatPrice(discountedPrice(product))}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                                    <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                                        -{Math.round(product.discountPercentage)}%
                                    </span>
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setWishlisted((w) => !w)}
                            className="flex shrink-0 items-center gap-2 text-sm hover:text-gray-500"
                            aria-pressed={wishlisted}
                        >
                            <HeartIcon filled={wishlisted} className={wishlisted ? "text-red-500" : ""} />
                            <span className="hidden sm:inline">{wishlisted ? "In Wish List" : "Add to Wish List"}</span>
                        </button>
                    </div>

                    <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>

                    <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-500">
                            Availability:
                            <span className={`ml-2 rounded px-2 py-0.5 text-sm font-medium ${availabilityColor(product.availabilityStatus)}`}>
                                {product.availabilityStatus}
                            </span>
                        </span>
                        <span className="text-sm text-gray-500">{product.stock} left</span>
                    </div>

                    {product.tags.length > 0 && (
                        <div className="border-b border-gray-200 py-4">
                            <p className="mb-3 text-gray-500">Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="rounded bg-gray-100 px-2.5 py-1 text-sm capitalize">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="flex h-12 items-center rounded-full border border-gray-300">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="h-full px-4 text-lg disabled:text-gray-300"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                                disabled={quantity >= maxQuantity}
                                className="h-full px-4 text-lg disabled:text-gray-300"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={outOfStock || maxQuantity === 0}
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-8 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            <CartIcon />
                            {outOfStock ? "Out of Stock" : maxQuantity === 0 ? "All stock in your cart" : justAdded ? "Added to cart ✓" : "Add to Cart"}
                        </button>
                    </div>
                    {inCart > 0 && (
                        <p className="mt-3 text-sm text-gray-500">
                            {inCart} in your cart · <Link to="/cart" className="font-medium text-gray-900 underline underline-offset-2">View cart</Link>
                        </p>
                    )}

                    <ul className="mt-6 space-y-3 rounded-xl bg-gray-50 p-5 text-sm">
                        <li className="flex items-center gap-3"><TruckIcon className="shrink-0 text-emerald-600" />{product.shippingInformation}</li>
                        <li className="flex items-center gap-3"><ReturnIcon className="shrink-0 text-emerald-600" />{product.returnPolicy}</li>
                        <li className="flex items-center gap-3"><ShieldIcon className="shrink-0 text-emerald-600" />{product.warrantyInformation}</li>
                    </ul>

                    <div className="mt-6 flex items-center gap-2">
                        <span className="mr-1 text-sm text-gray-500">We accept</span>
                        {["VISA", "Mastercard", "AMEX"].map((method) => (
                            <span key={method} className="rounded border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <ProductTabs product={product} />

            {(related.loading || (relatedProducts && relatedProducts.length > 0)) && (
                <section className="mt-16">
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">You may also like</h2>
                    <ProductGrid products={relatedProducts} loading={related.loading} skeletonCount={4} />
                </section>
            )}
        </div>
    );
};
