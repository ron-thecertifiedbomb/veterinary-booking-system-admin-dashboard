import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function Navbar() {
    const router = useRouter();
    const path = usePathname(); // ✅ direct, no custom hook for now

    return (
        <View className="w-full bg-white px-6 py-4 flex-row justify-between">
            <Text className="text-xl font-bold mb-4">
                🐾 Vet Booking
            </Text>

            <View className="flex-row gap-4">
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Text style={{ color: path === "/home" ? "blue" : "black" }}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/dashboard")}>
                    <Text style={{ color: path === "/dashboard" ? "blue" : "black" }}>
                        Dashboard
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}