import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
    if (Platform.OS === "web") {
        return <Redirect href="/(web)/home" />;
    }

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,

                // ✅ CLEAN TAB BAR STYLE
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 6,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },

                tabBarActiveTintColor: "#111827",
                tabBarInactiveTintColor: "#9ca3af",

                // ✅ ICONS (KILLER PART)
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "home") {
                        return <Ionicons name="home-outline" size={20} color={color} />;
                    }

                    if (route.name === "schedule") {
                        return <Ionicons name="calendar-outline" size={20} color={color} />;
                    }

                    return null;
                },
            })}
        >
            <Tabs.Screen
                name="home"
                options={{ title: "Home" }}
            />

            <Tabs.Screen
                name="schedule"
                options={{ title: "Schedule" }}
            />
        </Tabs>
    );
}