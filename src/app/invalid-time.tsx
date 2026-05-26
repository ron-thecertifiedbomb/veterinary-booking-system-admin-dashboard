import { View, Text } from "react-native";

export default function InvalidTime() {
    return (
        <View className="flex-1 justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-2">
                Incorrect Device Time
            </Text>

            <Text className="text-center text-gray-500">
                Please enable automatic date & time to continue.
            </Text>
        </View>
    );
}
``