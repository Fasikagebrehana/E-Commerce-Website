import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { login as loginRequest } from "../api/auth";
import type { AuthUser } from "../types/user";
import { readStorage, writeStorage } from "../utils/storage";

const STORAGE_KEY = "auth";

type Session = { token: string; user: AuthUser };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(() => readStorage(STORAGE_KEY, null));

    useEffect(() => {
        writeStorage(STORAGE_KEY, session);
    }, [session]);

    const login = async (username: string, password: string) => {
        const data = await loginRequest(username, password);
        setSession({
            token: data.accessToken,
            user: {
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                image: data.image,
            },
        });
    };

    const logout = () => setSession(null);

    return (
        <AuthContext value={{ user: session?.user ?? null, token: session?.token ?? null, login, logout }}>
            {children}
        </AuthContext>
    );
};
