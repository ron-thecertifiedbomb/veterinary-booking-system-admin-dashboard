import { getStorageItem } from "@/features/auth/storage";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

export default function AppUserLayout() {
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // ✅ block web
    if (Platform.OS === "web") {
        return <Redirect href="/(admin-web))/dashboard" />;
    }

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

    // ✅ wait for storage load
    if (loading) return null;

    // ✅ not authenticated
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ not USER → redirect
    if (user?.role !== "USER") {
        return <Redirect href="/(admin-app)/dashboard" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#111827",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    height: 64 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: Math.max(insets.bottom, 12),
                    borderTopWidth: 0,
                    backgroundColor: "#FFFFFF",
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="schedule"
                options={{
                    title: "Schedule",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
