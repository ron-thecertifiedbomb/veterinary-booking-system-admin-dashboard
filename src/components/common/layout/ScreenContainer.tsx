// src/components/layout/ScreenContainer.tsx

import { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
    children: ReactNode;
};

export default function ScreenContainer({
    children,
}: ScreenContainerProps) {

    return (
        <SafeAreaView className="flex-1 bg-background items-center px-6">
            <View className="flex-1 w-full max-w-md justify-center">
                {children}
            </View>
        </SafeAreaView>
    );

}