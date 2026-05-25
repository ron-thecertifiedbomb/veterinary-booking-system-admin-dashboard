import { formatDate, formatTime } from "@/utils/date";
import { formatBookingCode } from "@/utils/formatter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccess() {

    const router = useRouter();
    const { ownerName, bookingCode, petName, serviceType, date, time } =
        useLocalSearchParams<{
            bookingCode: string;
            ownerName: string;
            petName: string;
            serviceType: string;
            date: string;
            time: string;
        }>();

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <View className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-6">
                <Text className="text-2xl font-semibold text-text-primary text-center">
                    Booking Submitted
                </Text>
                <Text className="text-sm text-text-muted text-center mt-2 mb-6">
                    Your appointment request has been submitted successfully.
                </Text>
                <View className="bg-background rounded-xl p-4 mb-6">
                    <Text className="text-xs text-text-muted uppercase mb-2">
                        Booking Details
                    </Text>
                    <Text className="text-sm text-text-secondary mb-1">
                        BookingCode: {formatBookingCode(bookingCode)}
                    </Text>
                    <Text className="text-sm text-text-secondary mb-1">
                        Owner: {ownerName}
                    </Text>
                    <Text className="text-sm text-text-secondary mb-1">
                        Pet: {petName}
                    </Text>
                    <Text className="text-sm text-text-secondary mb-1">
                        Service: {serviceType}
                    </Text>
                    <Text className="text-sm text-text-primary mt-3 font-medium">
                        {formatDate(String(date))} at {formatTime(String(time))}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.replace("/home")}
                    className="bg-black rounded-xl py-3"
                >
                    <Text className="text-white text-center font-medium">
                        Book Another Appointment
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}