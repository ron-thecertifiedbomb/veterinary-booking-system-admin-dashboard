import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDate, getTodayDate } from "@/utils/date";
import { useEffect } from "react";
import { View, Text, FlatList } from "react-native";

export default function Appointments() {
    const date = getTodayDate();
    const now = new Date();
    const {
        fetchAppointments,
        appointments,
        loading,
        error,
    } = useGetUserAppointments();

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ✅ Loading
    if (loading) return <Loader fullScreen />;

    // ✅ Error
    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-sm text-center">
                    {error}
                </Text>
            </View>
        );
    }

    // ✅ Empty
    if (!appointments.length) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-base text-text-secondary">
                    No past appointments
                </Text>
                <Text className="text-xs text-text-muted mt-1">
                    Completed and cancelled bookings will appear here.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        My Appointments
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

                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.bookingCode}
                    contentContainerStyle={{
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {

                        const statusColor =
                            item.status === "booked"
                                ? "bg-green-100 text-green-700"
                                : item.status === "cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600";

                        return (
                            <View className="bg-surface border border-border rounded-2xl p-5 mb-3">

                                {/* Top Row */}

                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-base font-semibold text-text-primary">
                                        {item.petName}
                                    </Text>

                             
                                </View>


                                {/* Service */}
                                <Text className="text-sm text-text-secondary">
                                    {item.serviceType}
                                </Text>

                                <View className="h-px bg-border my-3" />

                                {/* Date */}
                                <Text className="text-xs text-slate-800 mt-1">
                                  Date: {new Date(item.appointmentDate).toLocaleDateString()}
                                </Text>
                                {/* Time */}
                                <Text className="text-xs text-slate-800 mt-1">
                                    Time: {new Date(item.appointmentDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>

                                {/* Reference */}
                                <Text className="text-xs text-slate-800 mt-1">
                                    Ref: {item.bookingCode}
                                </Text>

                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}
``