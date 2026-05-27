
import { formatDate, getTodayDate } from "@/utils/date";
import { View, Text } from "react-native";
export default function Pets() {

    const date = getTodayDate();
    const now = new Date();
    

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        My Pets
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        Track and review your upcoming and past bookings.
                    </Text>
                </View>

                {/* ✅ DATE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today is
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>

                    {/* ✅ Time */}
                    <Text className="text-xs text-text-secondary mt-1">
                        Time: {now.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

          
            </View>
        </View>
    );
}
