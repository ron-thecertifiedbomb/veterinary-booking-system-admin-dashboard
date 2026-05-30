import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDate, getTodayDate } from "@/utils/dateandtime/date";
import { formatBookingCode } from "@/utils/formatter";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, Platform, ScrollView, Text, View } from "react-native";

export default function Appointments() {
    const date = getTodayDate();
    const now = new Date();
    const {
        fetchAppointments,
        appointments,
        loading,
        error,
    } = useGetUserAppointments();

    
    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );
    const isEmpty = appointments.length === 0;
    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(
            isWeb
                ? "/(web)/web-home"
                : "(app)/home"
        );
    };
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
 
    return (
        <View
            className="flex-1 bg-background items-center px-6 pb-10"
         
        >
            <View className="w-full max-w-3xl pt-6 lg:p-14">

                {/* ✅ HEADER */}
                <View className="mb-6">

                    <Text className="text-lg lg:text-3xl font-semibold text-text-primary">
                        My Appointments
                    </Text>
                    <Text className="text-xs text-text-secondary lg:mt-1">
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
                {isEmpty && (
                    <EmptyState
                        icon=""
                        title="No appointments booked"
                        description="Add your first appointment."
                        buttonLabel="Booked an Appointment"
                        onPress={handleAddAppointment}
                    />
                )}
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.bookingCode}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const date = new Date(item.appointmentDate);

                        const statusConfig = {
                            booked: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Booked" },
                            cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
                            completed: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500", label: "Completed" },
                        }[item.status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: item.status };

                        const serviceEmoji =
                            item.serviceType === "Grooming" ? "✂️"
                                : item.serviceType === "Vaccination" ? "💉"
                                    : item.serviceType === "Checkup" ? "🩺"
                                        : item.serviceType === "Dental" ? "🦷"
                                            : "🐾";

                        return (
                            <View className="bg-surface border border-border rounded-2xl p-5 mb-3">

                                {/* ✅ HEADER */}
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center">
                                            <Text className="text-xl">{serviceEmoji}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-base font-semibold text-text-primary">
                                                {item.petName}
                                            </Text>
                                            <Text className="text-xs text-text-muted">
                                                {item.serviceType}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ✅ STATUS BADGE */}
                                    <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                                        <View className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                        <Text className={`text-xs font-medium ${statusConfig.text}`}>
                                            {statusConfig.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* ✅ DIVIDER */}
                                <View className="h-px bg-border mb-4" />

                                {/* ✅ DETAILS */}
                                <View className="flex-row gap-4 mb-3">
                                    <View className="flex-1">
                                        <Text className="text-xs text-text-muted mb-1">Date</Text>
                                        <Text className="text-sm font-medium text-text-primary">
                                            {date.toLocaleDateString([], {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs text-text-muted mb-1">Time</Text>
                                        <Text className="text-sm font-medium text-text-primary">
                                            {date.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </View>
                                </View>

                                {/* ✅ BOOKING REF */}
                                <View className="bg-background rounded-xl px-4 py-3">
                                    <Text className="text-xs text-text-muted mb-0.5">Booking Reference</Text>
                                    <Text className="text-sm font-mono font-semibold text-text-primary tracking-wide">
                                        {formatBookingCode(item.bookingCode)}
                                    </Text>
                                </View>

                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}
``