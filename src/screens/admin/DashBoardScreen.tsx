import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppointments } from "@/hooks/useAppointments";
import { useUpdateAppointmentStatus } from "@/hooks/useUpdateAppointmentStatus";
import { Appointment } from "@/features/admin/types";
import { logger } from "@/utils/logger";

export default function DashBoardScreen() {
    
    const { appointments, loading, refresh } = useAppointments();
    const { updateStatus, updatingId } = useUpdateAppointmentStatus();

    const normalizeStatus = (status: string): Appointment["status"] => {
        return status.toLowerCase().trim() as Appointment["status"];
    };

    const handleStatus = async (
        id: number,
        status: Appointment["status"]
    ) => {
        try {
            await updateStatus(id, status);
            refresh();
        } catch (err) {
            logger.error("Status update failed", err);
        }
    };

    const getStatusBadge = (status: Appointment["status"]) => {
        switch (status) {
            case "confirmed":
                return "bg-blue-50 text-blue-600";
            case "completed":
                return "bg-green-50 text-green-600";
            case "cancelled":
                return "bg-red-50 text-red-500";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatAppointmentDate = (value: string) => {
        return new Date(value).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <Text className="text-text-secondary">
                    Loading appointments...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 pt-8 pb-4">
                <View className="w-full max-w-xl mx-auto px-4">
                    <Text className="text-2xl font-semibold text-text-primary">
                        Admin Dashboard
                    </Text>

                    <Text className="text-sm text-text-muted mt-1">
                        Review and manage appointment requests
                    </Text>
                </View>
            </View>

            <View className="flex-1">
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 120,
                    }}
                >
                    <View className="w-full max-w-xl mx-auto px-4">
                        {appointments.length === 0 ? (
                            <View className="bg-surface border border-border rounded-2xl p-6 mt-6">
                                <Text className="text-text-primary font-semibold text-base">
                                    No appointments yet
                                </Text>

                                <Text className="text-text-muted text-sm mt-1">
                                    New bookings will appear here once clients schedule a visit.
                                </Text>
                            </View>
                        ) : (
                            appointments.map((item: Appointment) => {
                                const status = normalizeStatus(item.status);
                                const isUpdating = updatingId === item.id;

                                return (
                                    <View
                                        key={item.id}
                                        className="bg-surface border border-border rounded-2xl p-5 mb-4"
                                    >
                                        <View className="flex-row justify-between items-start gap-3">
                                            <View className="flex-1">
                                                <Text className="text-base font-semibold text-text-primary">
                                                    {item.ownerName}
                                                </Text>

                                                <Text className="text-sm text-text-secondary mt-1">
                                                    {item.petName} • {item.serviceType}
                                                </Text>
                                            </View>

                                            <View
                                                className={`px-3 py-1 rounded-full ${getStatusBadge(
                                                    status
                                                )}`}
                                            >
                                                <Text className="text-xs font-medium capitalize">
                                                    {status}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="mt-4 bg-background rounded-xl px-4 py-3">
                                            <Text className="text-xs text-text-muted uppercase">
                                                Appointment
                                            </Text>

                                            <Text className="text-sm text-text-primary mt-1">
                                                {formatAppointmentDate(item.appointmentDate)}
                                            </Text>
                                        </View>

                                        <View className="flex-row items-center gap-2 mt-4">
                                            {status === "pending" && (
                                                <>
                                                    <TouchableOpacity
                                                        disabled={isUpdating}
                                                        onPress={() =>
                                                            handleStatus(item.id, "confirmed")
                                                        }
                                                        className={`flex-1 rounded-xl py-3 ${isUpdating ? "bg-gray-400" : "bg-black"
                                                            }`}
                                                    >
                                                        {isUpdating ? (
                                                            <ActivityIndicator size="small" color="#ffffff" />
                                                        ) : (
                                                            <Text className="text-white text-center text-sm font-medium">
                                                                Confirm
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        disabled={isUpdating}
                                                        onPress={() =>
                                                            handleStatus(item.id, "cancelled")
                                                        }
                                                        className="flex-1 bg-gray-100 rounded-xl py-3"
                                                    >
                                                        <Text className="text-gray-700 text-center text-sm font-medium">
                                                            Cancel
                                                        </Text>
                                                    </TouchableOpacity>
                                                </>
                                            )}

                                            {status === "confirmed" && (
                                                <>
                                                    <TouchableOpacity
                                                        disabled={isUpdating}
                                                        onPress={() =>
                                                            handleStatus(item.id, "completed")
                                                        }
                                                        className={`flex-1 rounded-xl py-3 ${isUpdating ? "bg-gray-400" : "bg-black"
                                                            }`}
                                                    >
                                                        {isUpdating ? (
                                                            <ActivityIndicator size="small" color="#ffffff" />
                                                        ) : (
                                                            <Text className="text-white text-center text-sm font-medium">
                                                                Complete
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        disabled={isUpdating}
                                                        onPress={() =>
                                                            handleStatus(item.id, "cancelled")
                                                        }
                                                        className="flex-1 bg-gray-100 rounded-xl py-3"
                                                    >
                                                        <Text className="text-gray-700 text-center text-sm font-medium">
                                                            Cancel
                                                        </Text>
                                                    </TouchableOpacity>
                                                </>
                                            )}

                                            {(status === "completed" || status === "cancelled") && (
                                                <View className="w-full bg-background rounded-xl py-3">
                                                    <Text className="text-center text-text-muted text-sm">
                                                        {status === "completed"
                                                            ? "Completed appointment"
                                                            : "Cancelled appointment"}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </ScrollView>
            </View>

            <View
                style={{ pointerEvents: "box-none" }}
                className="absolute bottom-6 right-6"
            >
                <TouchableOpacity
                    onPress={refresh}
                    className="bg-black px-5 py-3 rounded-full"
                >
                    <Text className="text-white text-sm font-medium">
                        Refresh
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}