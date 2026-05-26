import { View, Text, Pressable, Animated } from "react-native";
import { Link, usePathname } from "expo-router";

type SidebarProps = {
    isMobile: boolean;
    translateX: Animated.Value;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
};

export default function Sidebar({
    isMobile,
    translateX,
    sidebarOpen,
    toggleSidebar,
}: SidebarProps) {
    const pathname = usePathname();

    const NavItem = ({ label, href }: { label: string; href: string }) => {
        const active = pathname.includes(href);

        return (
            <Link href={href} asChild>
                <Pressable
                    onPress={isMobile ? toggleSidebar : undefined}
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        marginBottom: 8,
                        borderRadius: 8,
                        backgroundColor: active ? "#1e293b" : "transparent",
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: active ? "600" : "400" }}>
                        {label}
                    </Text>
                </Pressable>
            </Link>
        );
    };

    // ✅ Desktop Sidebar
    if (!isMobile) {
        return (
            <View
                style={{
                    width: 250,
                    backgroundColor: "#0f172a",
                    padding: 16,
                }}
            >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
                    Dashboard
                </Text>

                <NavItem label="Home" href="/(web)/home" />
                <NavItem label="Appointments" href="/(web)/appointments" />
            </View>
        );
    }

    // ✅ Mobile Sidebar (Slide-in)
    return (
        <>
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 250,
                    backgroundColor: "#0f172a",
                    padding: 16,
                    transform: [{ translateX }],
                    zIndex: 10,
                }}
            >
                <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
                    Dashboard
                </Text>

                <NavItem label="Home" href="/(web)/home" />
                <NavItem label="Appointments" href="/(web)/appointments" />
            </Animated.View>

            {/* ✅ Overlay */}
            {sidebarOpen && (
                <Pressable
                    onPress={toggleSidebar}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 5,
                    }}
                />
            )}
        </>
    );
}