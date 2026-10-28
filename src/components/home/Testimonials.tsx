import { getRandomQuotes } from "../../api/quotes";
import { useFetch } from "../../hooks/useFetch";

const Testimonials = () => {
    const { data: quotes, loading, error } = useFetch("quotes", () => getRandomQuotes(3));

    // purely decorative, so hide the section rather than show an error
    if (error) return null;

    return (
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {loading
                ? Array.from({ length: 3 }, (_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-gray-100" />)
                : quotes?.map((quote) => (
                    <figure key={quote.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
                        <span className="font-serif text-5xl leading-none text-emerald-500">“</span>
                        <blockquote className="mt-1 flex-1 text-gray-700">{quote.quote}</blockquote>
                        <figcaption className="mt-5 flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                {quote.author.charAt(0)}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{quote.author}</span>
                        </figcaption>
                    </figure>
                ))}
        </div>
    );
};

export default Testimonials;
