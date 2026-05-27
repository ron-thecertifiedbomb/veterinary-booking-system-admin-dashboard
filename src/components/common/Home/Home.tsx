import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import Loader from "@/components/common/Loader/Loader";

import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useBookingBootstrap } from "@/hooks/appointments/useBookingBootstrap";

import { parseServerNow } from "@/utils/dateandtime/serverTime";
import { getTodayDate } from "@/utils/dateandtime/date";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Home() {
    const router = useRouter();

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);

    const {
        slots,
        loading,
        error: fetchError,
        serverNow,
    } = useBookingBootstrap(date);

    // ✅ ✅ ✅ SINGLE SOURCE OF TIME
    const now = parseServerNow(serverNow);

    const {
        createAppointment,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateAppointment();

    const [initialLoading, setInitialLoading] = useState(true);

    // ✅ Initial loading (prevent flicker)
    useEffect(() => {
        if (!loading) {
            setInitialLoading(false);
        }
    }, [loading]);

    // ✅ Reset success state
    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            resetSuccess();
        }, 2500);

        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    // ✅ Modal loading sync
    useEffect(() => {
        if (!showModal) return;
        if (loading) return;

        setModalChecking(false);
    }, [showModal, loading]);

    // ✅ Loading screen
    if (initialLoading) {
        return <Loader fullScreen />;
    }

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Book an Appointment
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        Select a service and choose your preferred schedule.
                    </Text>
                </View>

                {/* ✅ DATE / TIME CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today is
                    </Text>

                    {/* ✅ DATE (SERVER) */}
                    <Text className="text-base font-semibold text-text-primary">
                        {now.date}
                    </Text>

                    {/* ✅ TIME (SERVER) */}
                    <Text className="text-xs text-text-secondary mt-1">
                        {now.time}
                    </Text>
                </View>

                {/* ✅ DATE SELECTOR */}
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

                // ✅ ✅ ✅ ADD THESE
                date={now.date}
                timeDisplay={now.time}

                onClose={() => {
                    setShowModal(false);
                    setModalChecking(false);
                }}

                onSubmit={async (formData) => {
                    if (!formData.time) {
                        return;
                    }

                    try {
                        const appointment = await createAppointment({
                            petName: formData.petName,
                            serviceType: formData.serviceType,
                            time: formData.time,
                            date,
                            notes: formData.notes || "",
                        });

                        setShowModal(false);
                        setModalChecking(false);

                        setTimeout(() => {
                            router.push({
                                pathname: "/success",
                                params: {
                                    code: appointment.bookingCode,
                                },
                            });
                        }, 600);

                    } catch {
                        // handled in hook
                    }
                }}
            />
        </View>
    );
}