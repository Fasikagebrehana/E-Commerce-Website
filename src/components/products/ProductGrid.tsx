import type { Product } from "../../types/product";
import ProductsCard from "./productsCard";

type Props = {
    products?: Product[];
    loading?: boolean;
    skeletonCount?: number;
    className?: string;
};

const ProductGrid = ({
    products = [],
    loading = false,
    skeletonCount = 8,
    className = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: Props) => {
    return (
        <div className={`grid gap-4 md:gap-6 ${className}`}>
            {loading
                ? Array.from({ length: skeletonCount }, (_, i) => (
                    <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-gray-200">
                        <div className="aspect-square bg-gray-100" />
                        <div className="space-y-2 p-4">
                            <div className="h-3 w-1/3 rounded bg-gray-100" />
                            <div className="h-4 w-4/5 rounded bg-gray-100" />
                            <div className="h-4 w-1/4 rounded bg-gray-100" />
                        </div>
                    </div>
                ))
                : products.map((product) => <ProductsCard key={product.id} product={product} />)}
        </div>
    );
};

export default ProductGrid;
