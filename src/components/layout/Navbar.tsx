import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCategories } from "../../api/products";
import { useFetch } from "../../hooks/useFetch";
import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/authContext";
import { CartIcon, ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "../common/icons";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"}`;

export const Navbar = () => {
    const { data: categories } = useFetch("categories", getCategories);
    const { count } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close the categories dropdown on a click outside it or on Escape
    useEffect(() => {
        if (!categoriesOpen) return;
        const handleClick = (event: MouseEvent) => {
            if (!dropdownRef.current?.contains(event.target as Node)) setCategoriesOpen(false);
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setCategoriesOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [categoriesOpen]);

    const closeMenus = () => {
        setMenuOpen(false);
        setCategoriesOpen(false);
    };

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        const q = search.trim();
        navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
        closeMenus();
    };

    const searchForm = (className: string) => (
        <form onSubmit={handleSearch} className={`relative ${className}`} role="search">
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
        </form>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-8">
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="-ml-2 rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>

                <Link to="/" onClick={closeMenus} className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 text-white">
                        <CartIcon size={18} />
                    </span>
                    Cartly
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                    <NavLink to="/products" className={navLinkClass}>Products</NavLink>
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setCategoriesOpen((open) => !open)}
                            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                            aria-expanded={categoriesOpen}
                            aria-haspopup="true"
                        >
                            Categories
                            <ChevronDownIcon size={16} className={`transition ${categoriesOpen ? "rotate-180" : ""}`} />
                        </button>
                        {categoriesOpen && (
                            <div className="absolute left-0 top-full mt-4 w-[34rem] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                                {categories ? (
                                    <div className="grid grid-cols-3 gap-1">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.slug}
                                                to={`/category/${category.slug}`}
                                                onClick={closeMenus}
                                                className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="px-3 py-2 text-sm text-gray-400">Loading categories...</p>
                                )}
                            </div>
                        )}
                    </div>
                </nav>

                {searchForm("ml-auto hidden max-w-sm flex-1 md:block")}

                <div className="ml-auto flex items-center gap-1 md:ml-0">
                    <Link to="/cart" onClick={closeMenus} className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100"
                        aria-label={`Cart, ${count} items`}>
                        <CartIcon size={22} />
                        {count > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-white">
                                {count > 99 ? "99+" : count}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <Link to="/account" onClick={closeMenus} className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-gray-100">
                            <img src={user.image} alt="" className="h-8 w-8 rounded-full bg-gray-100" />
                            <span className="hidden text-sm font-medium text-gray-700 sm:inline">{user.firstName}</span>
                        </Link>
                    ) : (
                        <Link to="/login" onClick={closeMenus}
                            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            <UserIcon size={20} />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-gray-200 bg-white px-4 pb-6 pt-4 lg:hidden">
                    {searchForm("mb-4 md:hidden")}
                    <nav className="flex flex-col">
                        <NavLink to="/" end onClick={closeMenus} className="border-b border-gray-100 py-3 font-medium text-gray-800">Home</NavLink>
                        <NavLink to="/products" onClick={closeMenus} className="border-b border-gray-100 py-3 font-medium text-gray-800">Products</NavLink>
                        <details className="group border-b border-gray-100">
                            <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-medium text-gray-800">
                                Categories
                                <ChevronDownIcon size={18} className="transition group-open:rotate-180" />
                            </summary>
                            <div className="grid grid-cols-2 gap-1 pb-3">
                                {categories?.map((category) => (
                                    <Link key={category.slug} to={`/category/${category.slug}`} onClick={closeMenus}
                                        className="rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50">
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </details>
                        <NavLink to={user ? "/account" : "/login"} onClick={closeMenus} className="py-3 font-medium text-gray-800">
                            {user ? "My account" : "Login"}
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
}
