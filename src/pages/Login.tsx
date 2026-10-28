import { useState, type FormEvent } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/authContext";

// dummyjson test account, see https://dummyjson.com/users
const DEMO_USERNAME = "emilys";
const DEMO_PASSWORD = "emilyspass";

export default function Login() {
    const { user, login } = useAuth();
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // only follow in-app paths, never another site
    const redirectParam = searchParams.get("redirect") ?? "";
    const redirect = redirectParam.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/account";

    if (user) return <Navigate to={redirect} replace />;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            await login(username.trim(), password);
        } catch (err) {
            setError(
                isAxiosError(err) && err.response?.status === 400
                    ? "Incorrect username or password."
                    : "Couldn't log in. Please try again."
            );
            setSubmitting(false);
        }
    };

    const inputClass = "mt-1.5 h-11 w-full rounded-md border border-gray-300 px-3 outline-none transition focus:border-gray-900";

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-500">Log in to check out and see your profile.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block text-sm font-medium text-gray-700">
                    Username
                    <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" className={inputClass} />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        autoComplete="current-password" className={inputClass} />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button type="submit" disabled={submitting}
                    className="h-12 w-full rounded-full bg-gray-900 font-medium text-white hover:bg-gray-700 disabled:bg-gray-400">
                    {submitting ? "Logging in..." : "Log in"}
                </button>
            </form>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                This is a demo store. Use the test account{" "}
                <code className="rounded bg-white px-1">{DEMO_USERNAME}</code> /{" "}
                <code className="rounded bg-white px-1">{DEMO_PASSWORD}</code>.
                <button type="button" onClick={() => { setUsername(DEMO_USERNAME); setPassword(DEMO_PASSWORD); }}
                    className="ml-1 font-medium text-gray-900 underline underline-offset-2">
                    Fill it in
                </button>
            </div>
        </div>
    );
}
