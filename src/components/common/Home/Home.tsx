import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useBookingBootstrap } from "@/hooks/appointments/useBookingBootstrap";

import { formatDate, getTodayDate } from "@/utils/date";
import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Loader from "@/components/common/Loader/Loader";

export default function Home() {

    const router = useRouter();

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);

    const { slots, loading, error: fetchError } = useBookingBootstrap(date);
    const now = new Date();
    const {
        createAppointment,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateAppointment();

    // ✅ ✅ ✅ NEW: initial loading guard
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            setInitialLoading(false);
        }
    }, [loading]);

    // ✅ reset success flag
    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => {
            resetSuccess();
        }, 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    // ✅ modal loading sync
    useEffect(() => {
        if (!showModal) return;
        if (loading) return;
        setModalChecking(false);
    }, [showModal, loading]);

    // ✅ ✅ ✅ FIXED: initial loading screen (NO FLICKER)
    if (initialLoading) {
        return <Loader fullScreen />   
    }

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Book an Appointment
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        Select a service and choose your preferred schedule.
                    </Text>
                </View>
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
                <DateSelector
                    date={date}
                    onDateChange={(newDate) => {
                        setModalChecking(true);
                        setShowModal(true);
                        setDate(newDate);
                    }}
                />
            </View>

            {/* ✅ BOOKING MODAL */}
            <BookingModal
                visible={showModal}
                slots={slots}
                checking={modalChecking || loading}
                creating={creating}
                error={fetchError || createError}
                onClose={() => {
                    setShowModal(false);
                    setModalChecking(false);
                }}
                onSubmit={async (formData) => {
                    try {
                        const appointment = await createAppointment({
                            petName: formData.petName,
                            serviceType: formData.serviceType,
                            time: formData.time,
                            date,
                            notes: formData.notes || "",
                        });

                        // ✅ close modal immediately
                        setShowModal(false);
                        setModalChecking(false);

                        // ✅ delay navigation (for toast visibility)
                        setTimeout(() => {
                            router.push({
                                pathname: "/success",
                                params: {
                                    code: appointment.bookingCode,
                                },
                            });
                        }, 800);

                    } catch {
                        // handled in hook
                    }
                }}
            />

        </View>
    );
}