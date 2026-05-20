import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateSelector from "@/components/booking/DateSelector";
import BookingModal from "@/components/booking/BookingModal";

import { getTodayDate } from "@/utils/date";

import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useBookingBootstrap } from "@/hooks/useBookingBootstrap ";

export default function Home() {
  const [date, setDate] = useState(getTodayDate());
  const [showModal, setShowModal] = useState(false);

  const { slots, loading } = useBookingBootstrap(date);

  const {
    createBooking,
    loading: creating,
    error,
    success,
    resetSuccess,
  } = useCreateBooking();

  // ✅ Auto-hide success tooltip
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetSuccess();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">

      {/* ✅ SUCCESS TOOLTIP */}
      {success && (
        <View className="absolute top-10 left-0 right-0 items-center z-50">
          <View className="bg-green-500 px-4 py-3 rounded-xl shadow">
            <Text className="text-white font-medium">
              ✅ Booking successful!
            </Text>
          </View>
        </View>
      )}

      {/* ✅ MAIN CONTENT */}
      <View className="max-w-md mx-auto w-full px-6 py-10">

        <DateSelector
          date={date}
          onDateChange={(d) => {
            setDate(d);
            setShowModal(true); 
  }}
/>

      </View>

      {/* ✅ MODAL */}
      <BookingModal
        visible={showModal}
        slots={slots}
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          await createBooking({ ...data, date });
          setShowModal(false); // ✅ close modal on success
        }}
      />

      {/* ✅ OPTIONAL ERROR DISPLAY */}
      {error && (
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <Text className="text-red-500">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}