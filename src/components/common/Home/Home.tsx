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
        <View className="flex-1 bg-background items-center px-6">

            <View className="w-full max-w-xl pt-24">

                {/* ✅ HEADER */}
                <View className="mb-6">
                    <Text className="text-2xl lg:text-4xl font-semibold text-text-primary">
                        Book an appointment
                    </Text>
                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Select a date to schedule your pet’s visit.
                    </Text>
                </View>

                {/* ✅ DATE DISPLAY */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                        Selected Date
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>
                </View>

                {/* ✅ DATE PICKER */}
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