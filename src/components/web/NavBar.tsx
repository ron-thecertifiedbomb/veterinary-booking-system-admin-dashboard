import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";

type NavItem = {
    label: string;
    path: string;
};

type NavbarProps = {
    items: NavItem[];
};

export default function Navbar({ items }: NavbarProps) {
    const router = useRouter();
    const path = usePathname();

    return (
        <View className="w-full bg-surface  ">

            {/* ✅ CENTERED CONTAINER */}
            <View className="max-w-md mx-auto w-full px-6 py-4 flex-row items-center justify-between">

                {/* ✅ BRAND */}
                <Text className="text-text-primary text-base font-semibold">
                    Vet Booking
                </Text>

                {/* ✅ NAV LINKS */}
                <View className="flex-row items-center gap-6">
                    {items.map((item) => {
                        const active = path === item.path;

                        return (
                            <TouchableOpacity
                                key={item.path}
                                onPress={() => router.push(item.path)}
                            >
                                <View className="items-center">
                                    <Text
                                        className={`text-sm font-medium ${active
                                                ? "text-text-primary"
                                                : "text-text-secondary"
                                            }`}
                                    >
                                        {item.label}
                                    </Text>

                                    {/* ✅ subtle underline */}
                                    {active && (
                                        <View className="h-[1px] w-full bg-text-primary rounded-full" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

            </View>
        </View>
    );
}
``