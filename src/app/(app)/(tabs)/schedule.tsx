import { sortAppointmentsByDate } from "@/utils/appointments/appointments";
import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";

export default function Schedule() {
    const {
        fetchAppointments,
        appointments,
        loading,
        error,
    } = useGetUserAppointments();

    useEffect(() => {
        
        fetchAppointments();
    }, []);

    if (loading) return <Loader fullScreen />;

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-red-500">{error}</Text>
            </SafeAreaView>
        );
    }

    const sortedAppointments = sortAppointmentsByDate(appointments);

    return (
        <SafeAreaView className="flex-1 bg-background px-6">

            {/* ✅ Header */}
            <Text className="text-lg font-semibold mt-6 mb-4">
                Schedule
            </Text>

            <FlatList
                data={sortedAppointments}
                keyExtractor={(item) => item.bookingCode}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View className="bg-surface border border-border rounded-2xl p-4 mb-3">

                        {/* Pet */}
                        <Text className="text-base font-semibold text-text-primary">
                            {item.petName}
                        </Text>

                        {/* Service */}
                        <Text className="text-sm text-text-secondary">
                            {item.serviceType}
                        </Text>

                        {/* Time */}
                        <Text className="text-xs text-text-muted mt-1">
                            {new Date(item.appointmentDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>

                        {/* Short Ref */}
                        <Text className="text-xs text-text-muted mt-1 tracking-wider">
                            Ref: {item.bookingCode.slice(0, 8).toUpperCase()}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
``