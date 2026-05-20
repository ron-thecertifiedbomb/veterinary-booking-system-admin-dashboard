import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { formatDate } from "@/utils/date";

type Props = {
    date: string;
    onDateChange: (date: string) => void;
    onContinue?: () => void;
};

export default function DateSelector({
    date,
    onDateChange,
    onContinue,
}: Props) {
    return (
        <View>
            <Text className="text-hero text-text-primary font-semibold mb-2">
                Book Appointment
            </Text>

            <Text className="text-base text-text-secondary mb-8">
                Select a date to schedule your pet’s visit.
            </Text>

            {/* ✅ Selected Date */}
            <View className="mt-4 mb-6">
                <Text className="text-xs text-text-muted uppercase mb-1">
                    Selected Date
                </Text>

                <Text className="text-lg font-semibold text-text-primary">
                    {formatDate(date)}
                </Text>
            </View>

            {/* ✅ Calendar */}
            <View className="bg-surface border border-border rounded-xl p-4">

                <Calendar
                    current={date}
                    minDate={new Date().toLocaleDateString("en-CA")}
                    onDayPress={(day) => {
                        onDateChange(day.dateString);
                        onContinue?.();
                    }}
                    markedDates={{
                        [date]: {
                            selected: true,
                            selectedColor: "#111827",
                            selectedTextColor: "#ffffff",
                        },
                    }}

                    // ✅ ADD THIS
                    theme={{
                        arrowColor: "#000000",
  }}
/>

            </View>

            {/* {onContinue && (
                <TouchableOpacity
                    onPress={onContinue}
                    className="bg-surfaceSoft border border-border rounded-xl py-4 mt-6"
                >
                    <Text className="text-center text-text-primary font-medium">
                        Continue Booking
                    </Text>
                </TouchableOpacity>
            )} */}
        </View>
    );
}