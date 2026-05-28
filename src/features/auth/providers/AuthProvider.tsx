// src/features/auth/providers/AuthProvider.tsx
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { AuthContextType } from "@/features/auth/providers/types";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/features/auth/storage";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/features/auth/types";
import { User } from "@/features/users/types";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";


const AuthContext = createContext<AuthContextType | null>(null);

let sessionCache: {
    user: User | null;
    token: string | null;
} = {
    user: null,
    token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const hydrated = useRef(false);

    // -----------------------------------
    // LOAD SESSION ONCE
    // -----------------------------------

    async function loadSession() {
        try {
            const [storedUser, storedToken] = await Promise.all([
                getStorageItem("user"),
                getStorageItem("access_token"),
            ]);
            const parsedUser: User | null = storedUser
                ? JSON.parse(storedUser)
                : null;

            sessionCache = { user: parsedUser, token: storedToken };
            setUser(parsedUser);
            setToken(storedToken);
        } catch (err) {
            logger.error("Auth load error:", err);
            sessionCache = { user: null, token: null };
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
            hydrated.current = true;
        }
    }

    useEffect(() => {
        if (!hydrated.current) {
            loadSession();
        }
    }, []);

    // -----------------------------------
    // API
    // -----------------------------------

    async function refreshSession() {
        setLoading(true);
        await loadSession();
    }

    async function setSession(userData: User, accessToken: string) {

        await Promise.all([
            setStorageItem("user", JSON.stringify(userData)),
            setStorageItem("access_token", accessToken),
        ]);
        sessionCache = { user: userData, token: accessToken };
        setUser(userData);
        setToken(accessToken);
    }

    async function logout() {
        try {
            logger.info("Logging out user");
            if (token) {
                await api("/api/vet/auth/logout", {
                    method: "POST",
                    token,
                });
            }
        } catch (error: any) {
            logger.error("Logout API failed", error);
        } finally {
            await Promise.all([
                removeStorageItem("user"),
                removeStorageItem("access_token"),
            ]);
            sessionCache = { user: null, token: null };
            setUser(null);
            setToken(null);
            logger.info("User session cleared");
        }
    }

    async function login(payload: LoginPayload): Promise<LoginResponse> {
        try {
            setLoading(true);
            const response = await api<LoginResponse>("/api/vet/auth/login", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const normalizedUser = {
                ...response.user,
                userId: response.user.userId || response.user.id,
            };
            await setSession(normalizedUser, response.access_token);
            logger.info("Login successful via AuthProvider", normalizedUser);
            return response;
        } catch (err: any) {
            const errorMessage =
                err?.response?.message ||
                err?.message ||
                "Failed to login";
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function register(payload: RegisterPayload): Promise<RegisterResponse | null> {
        try {
            setLoading(true);
            logger.info("Attempting registration via AuthProvider", { email: payload.email });
            const response = await api<RegisterResponse>("/api/vet/auth/register", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const normalizedUser = {
                ...response.user,
                userId: response.user.userId || response.user.id,
            };
            await setSession(normalizedUser, response.access_token);
            logger.info("Registration successful via AuthProvider", normalizedUser);
            return response;
        } catch (err: any) {
            logger.error("Registration failed via AuthProvider", err);
            const errorMessage =
                err?.response?.message ||
                err?.message ||
                "Registration failed";
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }


    const value: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "ADMIN", // ✓ convenience shortcut
        refreshSession,
        setSession,
        logout,
        login,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// -----------------------------------
// HOOK
// -----------------------------------

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}