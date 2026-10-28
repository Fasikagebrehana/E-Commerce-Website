import { useEffect, useState } from "react";

type Result<T> = { key: string; data?: T; error?: string };

// Runs `fetcher` whenever `key` changes (pass null to skip). Results are tagged with the
// key they belong to, so stale data is never shown and no state is set synchronously in the effect.
export function useFetch<T>(key: string | null, fetcher: () => Promise<T>) {
    const [result, setResult] = useState<Result<T> | null>(null);

    useEffect(() => {
        if (key === null) return;
        let ignore = false;

        fetcher()
            .then((data) => { if (!ignore) setResult({ key, data }); })
            .catch(() => { if (!ignore) setResult({ key, error: "Something went wrong. Please try again." }); });
        return () => { ignore = true; };
        // the key describes everything the fetcher depends on
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const current = result?.key === key ? result : null;
    return {
        data: current?.data,
        error: current?.error ?? "",
        loading: key !== null && current === null,
    };
}
