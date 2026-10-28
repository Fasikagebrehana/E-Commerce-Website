import { useState } from "react";
import type { Product } from "../../types/product";
import StarRating from "../common/StarRating";

const TABS = ["Product Details", "Shipping & Returns", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const ProductTabs = ({ product }: { product: Product }) => {
    const [activeTab, setActiveTab] = useState<Tab>("Product Details");
    const { width, height, depth } = product.dimensions;

    const specs = [
        { label: "Brand", value: product.brand },
        { label: "SKU", value: product.sku },
        { label: "Weight", value: `${product.weight} g` },
        { label: "Dimensions", value: `${width} × ${height} × ${depth} cm` },
        { label: "Minimum order", value: `${product.minimumOrderQuantity} units` },
        { label: "Barcode", value: product.meta.barcode },
    ].filter((spec) => spec.value);

    return (
        <section className="mt-16">
            <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-gray-50 px-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`-mb-px shrink-0 border-b-2 px-4 py-4 text-lg md:text-xl ${
                            activeTab === tab
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {tab}
                        {tab === "Reviews" && ` (${product.reviews.length})`}
                    </button>
                ))}
            </div>

            <div className="py-6 text-gray-600">
                {activeTab === "Product Details" && (
                    <div className="space-y-6">
                        <p className="leading-relaxed">{product.description}</p>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:max-w-3xl">
                            {specs.map((spec) => (
                                <div key={spec.label} className="flex justify-between border-b border-gray-100 pb-2">
                                    <dt className="text-gray-400">{spec.label}</dt>
                                    <dd className="text-gray-800">{spec.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                {activeTab === "Shipping & Returns" && (
                    <ul className="space-y-3">
                        <li><span className="font-medium text-gray-800">Shipping:</span> {product.shippingInformation}</li>
                        <li><span className="font-medium text-gray-800">Returns:</span> {product.returnPolicy}</li>
                        <li><span className="font-medium text-gray-800">Warranty:</span> {product.warrantyInformation}</li>
                    </ul>
                )}

                {activeTab === "Reviews" && (
                    product.reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {product.reviews.map((review, index) => (
                                <li key={index} className="py-4">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="font-medium text-gray-800">{review.reviewerName}</span>
                                        <StarRating rating={review.rating} size={14} />
                                        <span className="text-sm text-gray-400">
                                            {new Date(review.date).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <p className="mt-1">{review.comment}</p>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </section>
    );
};

export default ProductTabs;
