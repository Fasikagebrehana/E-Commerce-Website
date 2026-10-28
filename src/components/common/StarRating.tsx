const STAR_PATH =
    "M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8l-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z";

const StarRating = ({ rating, size = 18 }: { rating: number; size?: number }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => {
                // how much of this star is filled, between 0 and 1
                const fill = Math.max(0, Math.min(1, rating - i));
                return (
                    <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
                        <svg viewBox="0 0 20 20" width={size} height={size} className="absolute inset-0 text-gray-300">
                            <path d={STAR_PATH} fill="currentColor" />
                        </svg>
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <svg viewBox="0 0 20 20" width={size} height={size} className="text-amber-400">
                                <path d={STAR_PATH} fill="currentColor" />
                            </svg>
                        </span>
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;
