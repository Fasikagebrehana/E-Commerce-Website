import { createContext, useContext } from "react";
import type { AuthUser } from "../types/user";

export type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
};
