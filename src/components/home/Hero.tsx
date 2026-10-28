import { Link } from "react-router-dom";

const Hero = ({ images }: { images: string[] }) => {
    return (
        <section className="mx-auto max-w-7xl px-4 pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-14 text-white sm:px-12 lg:py-20">
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="relative grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">New season, new picks</p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Everything you love, delivered to your door.
                        </h1>
                        <p className="mt-5 max-w-md text-lg text-gray-300">
                            Shop top-rated beauty, tech, home and fashion with prices that are hard to beat.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/products" className="rounded-full bg-white px-7 py-3 font-semibold text-gray-900 transition hover:bg-gray-200">
                                Shop Now
                            </Link>
                            <a href="#categories" className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
                                Browse categories
                            </a>
                        </div>
                    </div>

                    <div className="hidden grid-cols-2 gap-4 sm:grid">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className={`aspect-square rounded-xl bg-white/10 p-4 ${i % 2 === 1 ? "translate-y-6" : ""}`}>
                                {images[i] && <img src={images[i]} alt="" className="h-full w-full object-contain" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
