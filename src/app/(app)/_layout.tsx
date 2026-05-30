// src/app/(app)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ consistent with other layouts
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { Redirect,  Slot } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppTabsLayout() {
    const { loading, user, isAuthenticated } = useAuth();

    if (loading) return <Loader />;

    if (!isAuthenticated || !user) {
        return <Redirect href={getRouteByRole(undefined, { isAuthenticated: false })} />;
    }

    if (Platform.OS !== "web" && user.role === "ADMIN") {
        return <Redirect href={getRouteByRole(user.role, { isAuthenticated: true })} />;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Slot />
        </SafeAreaView>
    );
}
        
