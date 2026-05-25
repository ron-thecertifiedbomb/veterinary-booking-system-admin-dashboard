import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppUserLayout() {
    const insets = useSafeAreaInsets();

    // ✅ block web
    if (Platform.OS === "web") {
        return <Redirect href="/(web)/home" />;
    }

    // ✅ retrieve auth
    const accessToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

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
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="schedule"
                options={{
                    title: "Schedule",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="calendar-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="time-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}