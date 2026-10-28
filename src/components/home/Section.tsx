import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    id?: string;
    title: string;
    subtitle?: string;
    viewAllTo?: string;
    className?: string;
    children: ReactNode;
};

const Section = ({ id, title, subtitle, viewAllTo, className = "", children }: Props) => {
    return (
        <section id={id} className={`mx-auto max-w-7xl scroll-mt-20 px-4 pt-16 ${className}`}>
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">{title}</h2>
                    {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
                </div>
                {viewAllTo && (
                    <Link to={viewAllTo} className="shrink-0 text-sm font-medium text-gray-900 underline-offset-4 hover:underline">
                        View all →
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
};

export default Section;
