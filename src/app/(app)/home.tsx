import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import { useBookingBootstrap } from "@/hooks/appointments/useBookingBootstrap";
import { useCreateBooking } from "@/hooks/appointments/useCreateBooking";

import { formatDate, getTodayDate } from "@/utils/date";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

export default function Home() {

    const router = useRouter();
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);
    const { slots, loading, error: fetchError } = useBookingBootstrap(date);

    const {
        createBooking,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateBooking();

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => {
            resetSuccess();
        }, 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    useEffect(() => {
        if (!showModal) return;
        if (loading) return;
        setModalChecking(false);
    }, [showModal, loading]);

    if (loading && !showModal) {
        return (
            <View className="flex-1 justify-center items-center bg-background px-6">
                <Text className="text-sm text-text-secondary">
                    Loading appointments...
                </Text>
            </View>
        );
    }
    return (
        <View className="flex-1 bg-background items-center px-6">
            <View className="w-full max-w-md pt-24">
                <View className="mb-6">
                    <Text className="text-4xl font-semibold text-text-primary">
                        Book an appointment
                    </Text>
                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Select a date to schedule your pet’s visit.
                    </Text>
                </View>
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                        Selected Date
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
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
                onSubmit={async (data) => {
                    const response = await createBooking({
                        ...data,
                        date,
                    });

                    if (!response) return; // Wait for user to resolve creation error

                    setShowModal(false);
                    setModalChecking(false);
                    const successPath =
                        Platform.OS === "web"
                            ? "/(web)/booking-success"
                            : "/(app)/booking-success";
                    router.push({
                        pathname: successPath,
                        params: {
                            bookingCode: response.bookingCode,
                            ownerName: response.ownerName,
                            petName: response.petName,
                            serviceType: response.serviceType,
                            date,
                            time: response.time,
                        },
                    });
                }}
            />
        </View>
    );
}