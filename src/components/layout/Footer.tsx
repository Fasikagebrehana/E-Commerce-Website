import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-gray-200 bg-gray-50">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <p className="text-xl font-bold text-gray-900">Cartly</p>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Beauty, tech, home and fashion, all in one place. A demo store built on the DummyJSON API.
                    </p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">Shop</p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-500">
                        <li><Link to="/products" className="hover:text-gray-900">All products</Link></li>
                        <li><Link to="/products?sort=meta.createdAt-desc" className="hover:text-gray-900">New arrivals</Link></li>
                        <li><Link to="/products?sort=discountPercentage-desc" className="hover:text-gray-900">Hot deals</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">Account</p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-500">
                        <li><Link to="/account" className="hover:text-gray-900">My account</Link></li>
                        <li><Link to="/cart" className="hover:text-gray-900">Cart</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Cartly. Product data from dummyjson.com.
            </div>
        </footer>
    );
};

export default Footer;
