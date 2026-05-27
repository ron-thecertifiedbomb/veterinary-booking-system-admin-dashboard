// src/app/(auth)/_layout.tsx
import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
    const { accessToken, user, loading } = useAuthGuard();

    if (loading) {
        // We can show a loading screen here to prevent a flash of the login screen.
        return <Loader fullScreen />;
    }

    if (accessToken) {
        const isWeb = Platform.OS === "web";

        // If the user is logged in, redirect them to the main part of the app.
        if (user?.role === "ADMIN") {
            return <Redirect href={isWeb ? "/(admin-web)/dashboard" : "/(admin-app)/dashboard"} />;
        }

        // Default redirect for 'USER' role
        return <Redirect href={isWeb ? "/(web)/home" : "/(app)/home"} />;
    }

    // If the user is not logged in, show the auth screens.
    return <Slot />;
}
