import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCategories, getProducts, getProductsByCategory, searchProducts, type ProductQuery } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 12;

// value is "<field>-<order>", matching dummyjson's sortBy/order params
const SORT_OPTIONS = [
    { value: "", label: "Recommended" },
    { value: "rating-desc", label: "Top rated" },
    { value: "meta.createdAt-desc", label: "Newest" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "discountPercentage-desc", label: "Biggest discount" },
    { value: "title-asc", label: "Name: A to Z" },
];

// used for both /products (all products or search results) and /category/:slug
export default function Products() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // dummyjson can't combine search with a category, so search only applies to /products
    const q = slug ? "" : (searchParams.get("q") ?? "").trim();
    const sort = searchParams.get("sort") ?? "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const { data, loading, error } = useFetch(`products|${slug}|${q}|${sort}|${page}`, () => {
        const separator = sort.lastIndexOf("-");
        const query: ProductQuery = {
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            sortBy: sort ? sort.slice(0, separator) : undefined,
            order: sort ? (sort.slice(separator + 1) as "asc" | "desc") : undefined,
        };
        if (slug) return getProductsByCategory(slug, query);
        if (q) return searchProducts(q, query);
        return getProducts(query);
    });
    const { data: categories } = useFetch("categories", getCategories);

    const category = categories?.find((c) => c.slug === slug);
    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
    const sortQuery = sort ? `?sort=${sort}` : "";
    const heading = slug ? (category?.name ?? slug) : q ? `Results for "${q}"` : "All Products";

    const updateParams = (changes: Record<string, string | null>) => {
        const next = new URLSearchParams(searchParams);
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        setSearchParams(next);
    };

    const changePage = (newPage: number) => {
        updateParams({ page: newPage > 1 ? String(newPage) : null });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const categoryLinkClass = (active: boolean) =>
        `block rounded-md px-3 py-2 text-sm transition ${active
            ? "bg-gray-900 font-medium text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <nav className="mb-4 text-sm text-gray-400">
                <Link to="/" className="hover:text-gray-600">Home</Link>
                <span className="mx-1">/</span>
                {slug ? (
                    <>
                        <Link to="/products" className="hover:text-gray-600">Products</Link>
                        <span className="mx-1">/</span>
                        <span className="text-gray-800">{heading}</span>
                    </>
                ) : (
                    <span className="text-gray-800">Products</span>
                )}
            </nav>

            <div className="flex gap-10">
                <aside className="hidden w-56 shrink-0 lg:block">
                    <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Categories</h2>
                    <div className="space-y-0.5">
                        <Link to={`/products${sortQuery}`} className={categoryLinkClass(!slug)}>All products</Link>
                        {categories?.map((c) => (
                            <Link key={c.slug} to={`/category/${c.slug}${sortQuery}`} className={categoryLinkClass(c.slug === slug)}>
                                {c.name}
                            </Link>
                        ))}
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{heading}</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {data ? `${data.total} products` : " "}
                                {q && (
                                    <Link to={`/products${sortQuery}`} className="ml-3 text-gray-900 underline underline-offset-2">
                                        Clear search
                                    </Link>
                                )}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={slug ?? ""}
                                onChange={(e) => navigate(`${e.target.value ? `/category/${e.target.value}` : "/products"}${sortQuery}`)}
                                className="h-10 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm lg:hidden"
                                aria-label="Category"
                            >
                                <option value="">All categories</option>
                                {categories?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                            </select>
                            <select
                                value={sort}
                                onChange={(e) => updateParams({ sort: e.target.value || null, page: null })}
                                className="h-10 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm sm:flex-none"
                                aria-label="Sort by"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error ? (
                        <p className="text-red-600">{error}</p>
                    ) : !loading && data?.products.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
                            <p className="text-lg font-medium text-gray-900">No products found</p>
                            <p className="mt-1 text-gray-500">Try a different search or browse all products.</p>
                            <Link to="/products" className="mt-5 inline-block rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white">
                                View all products
                            </Link>
                        </div>
                    ) : (
                        <ProductGrid
                            products={data?.products}
                            loading={loading}
                            skeletonCount={PAGE_SIZE}
                            className="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        />
                    )}

                    <div className="mt-10">
                        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
                    </div>
                </div>
            </div>
        </div>
    );
}
