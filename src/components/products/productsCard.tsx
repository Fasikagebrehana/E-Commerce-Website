import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../context/cartContext";
import { discountedPrice, formatPrice } from "../../utils/price";
import StarRating from "../common/StarRating";
import { CartIcon } from "../common/icons";

const ProductsCard = ({ product }: { product: Product }) => {
    const { addItem } = useCart();
    const hasDiscount = product.discountPercentage >= 1;
    const outOfStock = product.stock === 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg">
            <Link to={`/product/${product.id}`} className="relative block aspect-square bg-gray-50">
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                />
                {hasDiscount && (
                    <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        -{Math.round(product.discountPercentage)}%
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <p className="truncate text-xs uppercase tracking-wide text-gray-400">
                    {product.brand ?? product.category.replace(/-/g, " ")}
                </p>
                <Link to={`/product/${product.id}`} className="mt-1 line-clamp-2 font-medium text-gray-900 hover:underline">
                    {product.title}
                </Link>
                <div className="mt-2 flex items-center gap-1.5">
                    <StarRating rating={product.rating} size={14} />
                    <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                </div>

                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-semibold text-gray-900">{formatPrice(discountedPrice(product))}</span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => addItem(product)}
                        disabled={outOfStock}
                        className="shrink-0 rounded-full bg-gray-900 p-2 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        aria-label={outOfStock ? "Out of stock" : `Add ${product.title} to cart`}
                        title={outOfStock ? "Out of stock" : "Add to cart"}
                    >
                        <CartIcon size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ProductsCard;
