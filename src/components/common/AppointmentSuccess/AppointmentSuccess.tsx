import { formatDate, formatTime } from "@/utils/date";
import { formatBookingCode } from "@/utils/formatter";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStorageItem } from "@/features/auth/storage";
import Loader from "@/components/common/Loader/Loader";

export default function AppoinmentSuccess() {

    const router = useRouter();

    const [appointment, setAppointment] = useState<any>(null);

    useEffect(() => {
        const loadAppointment = async () => {
            try {
                const stored = await getStorageItem("appointments");
                const parsed = stored ? JSON.parse(stored) : [];

                if (parsed.length > 0) {
                    setAppointment(parsed[0]); // ✅ latest (we prepended earlier)
                }
            } catch {
                // optional: log error
            }
        };

        loadAppointment();
    }, []);

    if (!appointment) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-background">
                <Loader fullScreen={false} size="small" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <View className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-6">

                <Text className="text-2xl font-semibold text-text-primary text-center">
                    Appointment Summary
                </Text>

                <Text className="text-sm text-text-muted text-center mt-2 mb-6">
                    Your appointment request has been submitted successfully.
                </Text>

                <View className="bg-background rounded-xl p-4 mb-6">
                    <Text className="text-xs text-text-muted uppercase mb-2">
                        Booking Details
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Booking Code: {formatBookingCode(appointment.bookingCode)}
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Pet: {appointment.petName}
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Service: {appointment.serviceType}
                    </Text>

                    <Text className="text-sm text-text-primary mt-3 font-medium">
                        {formatDate(appointment.date)} at {formatTime(appointment.time)}
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