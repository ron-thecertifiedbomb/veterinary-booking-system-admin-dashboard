import { View, Text } from "react-native";

type CustomToastProps = {
    text1?: string;
};

export default function CustomToast({ text1 }: CustomToastProps) {
    return (
        <View className="w-full items-center px-6">
            <View
                style={{
                    backgroundColor: "rgba(0,0,0,0.9)", // ✅ SAFE
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    borderRadius: 16,
                    maxWidth: "90%",
                    alignSelf: "center",
                }}
            >
                <Text
                    style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "600",
                        textAlign: "center",
                    }}
                >
                    {text1}
                </Text>
            </View>
        </View>
    );
}