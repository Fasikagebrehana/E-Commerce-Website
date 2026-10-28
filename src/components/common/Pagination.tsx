type Props = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
};

// first, last and the pages around the current one, with gaps marked by "..."
const visiblePages = (page: number, totalPages: number) => {
    const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
        .filter((p) => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b);

    const result: (number | "...")[] = [];
    pages.forEach((p, i) => {
        if (i > 0 && p - pages[i - 1] > 1) result.push("...");
        result.push(p);
    });
    return result;
};

const Pagination = ({ page, totalPages, onChange }: Props) => {
    if (totalPages <= 1) return null;

    const buttonClass = "h-10 min-w-10 rounded-md border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}
                className={`${buttonClass} border-gray-200 hover:bg-gray-50`}>
                Prev
            </button>
            {visiblePages(page, totalPages).map((p, i) =>
                p === "..." ? (
                    <span key={`gap-${i}`} className="px-1 text-gray-400">…</span>
                ) : (
                    <button key={p} type="button" onClick={() => onChange(p)} aria-current={p === page ? "page" : undefined}
                        className={`${buttonClass} ${p === page
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 hover:bg-gray-50"}`}>
                        {p}
                    </button>
                )
            )}
            <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages}
                className={`${buttonClass} border-gray-200 hover:bg-gray-50`}>
                Next
            </button>
        </nav>
    );
};

export default Pagination;
