import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-2">
                History
            </Text>

           
        </SafeAreaView>
    );
}