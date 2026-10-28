import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { useAuth } from "../context/authContext";
import { useFetch } from "../hooks/useFetch";

const Detail = ({ label, value }: { label: string; value?: string | number }) => (
    <div>
        <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
        <dd className="mt-0.5 text-gray-800">{value || "—"}</dd>
    </div>
);

export default function Account() {
    const { user, token, logout } = useAuth();
    const { data: profile, loading, error } = useFetch(token ? `me|${token}` : null, () => getCurrentUser(token ?? ""));

    if (!user) return <Navigate to="/login?redirect=/account" replace />;

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <div className="flex flex-col gap-6 rounded-2xl bg-gray-900 p-6 text-white sm:flex-row sm:items-center sm:p-8">
                <img src={user.image} alt="" className="h-20 w-20 rounded-full bg-white/10" />
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h1>
                    <p className="text-gray-300">@{user.username} · {user.email}</p>
                </div>
                <button type="button" onClick={logout}
                    className="self-start rounded-full border border-white/30 px-5 py-2 text-sm font-medium hover:bg-white/10 sm:self-center">
                    Log out
                </button>
            </div>

            {error ? (
                <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="font-medium text-red-700">We couldn't load your profile. Your session may have expired.</p>
                    <button type="button" onClick={logout} className="mt-3 text-sm font-medium text-red-700 underline">
                        Log in again
                    </button>
                </div>
            ) : loading || !profile ? (
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-100" />)}
                </div>
            ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <section className="rounded-xl border border-gray-200 p-6">
                        <h2 className="mb-4 font-semibold text-gray-900">Personal</h2>
                        <dl className="space-y-3">
                            <Detail label="Phone" value={profile.phone} />
                            <Detail label="Birthday" value={profile.birthDate} />
                            <Detail label="Age" value={profile.age} />
                        </dl>
                    </section>
                    <section className="rounded-xl border border-gray-200 p-6">
                        <h2 className="mb-4 font-semibold text-gray-900">Shipping address</h2>
                        <address className="not-italic leading-relaxed text-gray-800">
                            {profile.address.address}<br />
                            {profile.address.city}, {profile.address.state} {profile.address.postalCode}<br />
                            {profile.address.country}
                        </address>
                    </section>
                    <section className="rounded-xl border border-gray-200 p-6">
                        <h2 className="mb-4 font-semibold text-gray-900">Work</h2>
                        <dl className="space-y-3">
                            <Detail label="Company" value={profile.company.name} />
                            <Detail label="Title" value={profile.company.title} />
                            <Detail label="Department" value={profile.company.department} />
                        </dl>
                    </section>
                </div>
            )}
        </div>
    );
}
