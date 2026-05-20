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

            {/* ✅ TITLE */}
            <Text className="text-hero text-text-primary font-semibold mb-2">
                Book Appointment
            </Text>

            <Text className="text-base text-text-secondary mb-8">
                Select a date to schedule your pet’s visit.
            </Text>

            {/* ✅ CALENDAR */}
            <View className="bg-surface border border-border rounded-xl p-4">
                <Calendar
                    current={date}
                    onDayPress={(day) => onDateChange(day.dateString)}
                    theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#ffffff",
                        textSectionTitleColor: "#6b7280",
                        monthTextColor: "#111827",
                        dayTextColor: "#111827",
                        todayTextColor: "#111827",
                        textDisabledColor: "#d1d5db",
                        arrowColor: "#6b7280",
                    }}
                />
            </View>

            {/* ✅ DATE DISPLAY */}
            <View className="mb-6 mt-6">
                <Text className="text-sm text-text-muted">Selected</Text>
                <Text className="text-base font-medium text-text-primary">
                    {formatDate(date)}
                </Text>
            </View>

            {/* ✅ CTA */}
            {onContinue && (
                <TouchableOpacity
                    onPress={onContinue}
                    className="bg-surfaceSoft border border-border rounded-xl py-4"
                >
                    <Text className="text-text-primary text-center font-medium">
                        Continue Booking
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    );
}
