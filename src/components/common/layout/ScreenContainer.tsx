// src/components/layout/ScreenContainer.tsx

import { ReactNode } from "react";
import { View } from "react-native";

type ScreenContainerProps = {
    children: ReactNode;
};

export default function ScreenContainer({
    children,
}: ScreenContainerProps) {

    return (
        <View className="flex-1 bg-background items-center px-6">
            <View className="flex-1 w-full max-w-md justify-center">
                {children}
            </View>
        </View>
    );

}