import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export default function Dashboard() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="max-w-4xl mx-auto w-full p-6">
                <Text className="text-2xl font-bold mb-6">
                    📊 Dashboard
                </Text>

                <View className="bg-white p-5 rounded-xl shadow">
                    <Text className="text-base">
                        Admin content here
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
