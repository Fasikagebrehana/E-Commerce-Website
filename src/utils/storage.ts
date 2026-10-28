// localStorage can throw (private mode, blocked storage), so reads and writes never fail loudly

export const readStorage = <T>(key: string, fallback: T): T => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
        return fallback;
    }
};

export const writeStorage = (key: string, value: unknown) => {
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage unavailable; state just won't persist across reloads
    }
};
