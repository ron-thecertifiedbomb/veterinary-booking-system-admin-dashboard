// src/features/appointments/components/Appointments.tsx

import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDate, getTodayDate } from "@/utils/date";
import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";


export default function Appointments() {

    const date = getTodayDate();
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
        <View className="flex-1 bg-background items-center px-6">
            <View className="w-full max-w-xl flex-1">
                {/* ✅ HEADER */}
                <View className="w-full max-w-md pt-24 mb-6">
                    <Text className="text-4xl font-semibold text-text-primary">
                       Appointments
                    </Text>
                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                      List of previous appointments
                    </Text>
                </View>

                {/* ✅ DATE DISPLAY */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                     Date Today
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>
                </View>
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.bookingCode}
                    // ✅ FORCE SCROLL AREA
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 24,
                        paddingBottom: 40,
                        flexGrow: 1, // 🔥 THIS FIXES YOUR ISSUE
                    }}

                    // ✅ SHOW SCROLLBAR
                    showsVerticalScrollIndicator={true}

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
                               Pet name:  {item.petName}
                            </Text>

                            <Text style={{ color: "#555", marginTop: 4 }}>
                              Service Type:  {item.serviceType}
                            </Text>

                            <Text style={{ marginTop: 6 }}>
                              Date:  {new Date(item.appointmentDate).toLocaleString()}
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
                              Status: {item.status.toUpperCase()}
                            </Text>
                        </View>
                    )}
                />

            </View>
        </View>
    );

}