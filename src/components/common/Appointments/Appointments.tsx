// src/features/appointments/components/Appointments.tsx

import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";


export default function Appointments() {
    const {
        fetchAppointments,
        appointments,
        loading,
        error,
    } = useGetUserAppointments();

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ✅ Loading state
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    // ✅ Empty state
    if (!appointments.length) {
        return (
            <View style={{ padding: 20 }}>
                <Text>No appointments found.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.bookingCode}

                // ✅ spacing inside scroll
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 24,
                    paddingBottom: 24,
                }}

                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 16,
                            marginBottom: 12,
                            borderRadius: 12,
                            backgroundColor: "#f9fafb",
                            borderWidth: 1,
                            borderColor: "#e5e7eb",
                        }}
                    >
                        <Text style={{ fontWeight: "700", fontSize: 16 }}>
                            {item.petName}
                        </Text>

                        <Text style={{ color: "#555", marginTop: 4 }}>
                            {item.serviceType}
                        </Text>

                        <Text style={{ marginTop: 6 }}>
                            {new Date(item.appointmentDate).toLocaleString()}
                        </Text>

                        <Text
                            style={{
                                marginTop: 6,
                                fontWeight: "600",
                                color:
                                    item.status === "booked"
                                        ? "green"
                                        : item.status === "cancelled"
                                            ? "red"
                                            : "gray",
                            }}
                        >
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}