import { getProducts } from '../api/products';
<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import ProductsCard from '../components/products/productsCard';
=======
import { useFetch } from '../hooks/useFetch';
import ProductGrid from '../components/products/ProductGrid';
import Hero from '../components/home/Hero';
import Section from '../components/home/Section';
import CategoryGrid from '../components/home/CategoryGrid';
import Testimonials from '../components/home/Testimonials';
import { ReturnIcon, ShieldIcon, TruckIcon } from '../components/common/icons';

const PERKS = [
    { icon: TruckIcon, title: "Free shipping", text: "On all orders over $50" },
    { icon: ReturnIcon, title: "Easy returns", text: "30 days to change your mind" },
    { icon: ShieldIcon, title: "Secure checkout", text: "Visa, Mastercard & Amex" },
];
>>>>>>> Stashed changes

const Home = () => {
    const featured = useFetch("home-featured", () => getProducts({ limit: 8, sortBy: "rating", order: "desc" }));
    const newArrivals = useFetch("home-new", () => getProducts({ limit: 8, sortBy: "meta.createdAt", order: "desc" }));
    const hotDeals = useFetch("home-deals", () => getProducts({ limit: 4, sortBy: "discountPercentage", order: "desc" }));

    const heroImages = featured.data?.products.slice(0, 4).map((product) => product.thumbnail) ?? [];

    return (
        <div>
            <Hero images={heroImages} />

            <div className="mx-auto mt-6 grid max-w-7xl gap-3 px-4 sm:grid-cols-3">
                {PERKS.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-center gap-3 rounded-xl bg-gray-50 px-5 py-4">
                        <Icon size={26} className="shrink-0 text-emerald-600" />
                        <div>
                            <p className="font-medium text-gray-900">{title}</p>
                            <p className="text-sm text-gray-500">{text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Section title="Featured Products" subtitle="Our highest-rated picks" viewAllTo="/products?sort=rating-desc">
                {featured.error
                    ? <p className="text-red-600">{featured.error}</p>
                    : <ProductGrid products={featured.data?.products} loading={featured.loading} />}
            </Section>

            <Section id="categories" title="Shop by Category" subtitle="Find exactly what you're looking for">
                <CategoryGrid />
            </Section>

            <Section title="New Arrivals" subtitle="Fresh additions to the store" viewAllTo="/products?sort=meta.createdAt-desc">
                {newArrivals.error
                    ? <p className="text-red-600">{newArrivals.error}</p>
                    : <ProductGrid products={newArrivals.data?.products} loading={newArrivals.loading} />}
            </Section>

            <Section title="Hot Deals 🔥" subtitle="The biggest discounts right now" viewAllTo="/products?sort=discountPercentage-desc">
                <div className="rounded-2xl bg-red-50 p-4 md:p-6">
                    {hotDeals.error
                        ? <p className="text-red-600">{hotDeals.error}</p>
                        : <ProductGrid products={hotDeals.data?.products} loading={hotDeals.loading} skeletonCount={4} />}
                </div>
            </Section>

            <Section title="What People Are Saying">
                <Testimonials />
            </Section>
        </div>
    )
}
export default Home;
