import { Link } from "react-router-dom";
import { getCategories, getCategoryThumbnails } from "../../api/products";
import { useFetch } from "../../hooks/useFetch";

const CategoryGrid = () => {
    const { data: categories, loading, error } = useFetch("categories", getCategories);
    const { data: thumbnails } = useFetch("category-thumbnails", getCategoryThumbnails);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-4">
            {loading
                ? Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-gray-100" />
                ))
                : categories?.map((category) => (
                    <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        className="group flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-4 text-center transition hover:border-gray-300 hover:bg-white hover:shadow-md"
                    >
                        <div className="aspect-square w-full">
                            {thumbnails?.[category.slug] && (
                                <img src={thumbnails[category.slug]} alt="" loading="lazy"
                                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
                            )}
                        </div>
                        <span className="mt-3 text-sm font-medium text-gray-800">{category.name}</span>
                    </Link>
                ))}
        </div>
    );
};

export default CategoryGrid;
