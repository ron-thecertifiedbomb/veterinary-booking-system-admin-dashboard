import { getStorageItem } from "@/features/auth/storage";
import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";

export default function AppAdminLayout() {
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const bootstrap = async () => {
            const token = await getStorageItem("access_token");
            const storedUser = await getStorageItem("user");

            setAccessToken(token);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        bootstrap();
    }, []);

    // ✅ SHOW LOADING (NO BLANK SCREEN)
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#6b7280" />
            </View>
        );
    }

    // ✅ NOT AUTHENTICATED → GO TO LOGIN
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ WEB USERS → SEPARATE EXPERIENCE
    if (Platform.OS === "web") {
        return <Redirect href="/(admin-web)/home" />;
    }

    // ✅ ADMIN USERS → ADMIN DASHBOARD
    if (user?.role === "ADMIN") {
        return <Redirect href="/(admin-app)/dashboard" />;
    }

    // ✅ NORMAL USERS → ALLOW APP ACCESS
    return <Slot />;
}
