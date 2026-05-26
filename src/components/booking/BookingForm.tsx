import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { logger } from "@/utils/logger";

type Props = {
    petName: string;
    serviceType: string;
    notes: string;

    setPetName: (v: string) => void;
    setServiceType: (v: string) => void;
    setNotes: (v: string) => void;
};

const SERVICES = [
    "Checkup",
    "Vaccination",
    "Grooming",
    "Surgery",
    "Dental"
];

const PLACEHOLDER_COLOR = "#9CA3AF";

export default function BookingForm({
    petName,
    serviceType,
    notes,
    setPetName,
    setServiceType,
    setNotes,
}: Props) {

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <View className="gap-4 mb-5">

            {/* ✅ PET NAME */}
            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Pet Name
                </Text>

                <TextInput
                    value={petName}
                    onChangeText={(v) => {
                        logger.info("Pet Name changed", v);
                        setPetName(v);
                    }}
                    placeholder="Max"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-text-primary"
                />
            </View>

            {/* ✅ SERVICE TYPE */}
            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Service Type
                </Text>

                <Pressable
                    onPress={() => setShowDropdown(!showDropdown)}
                    className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                >
                    <Text
                        className={
                            serviceType
                                ? "text-text-primary"
                                : "text-gray-400"
                        }
                    >
                        {serviceType || "Select service"}
                    </Text>
                </Pressable>

                {showDropdown && (
                    <View className="border border-gray-200 rounded-xl mt-2 bg-white overflow-hidden">
                        {SERVICES.map((item) => (
                            <Pressable
                                key={item}
                                onPress={() => {
                                    logger.info("Service selected", item);
                                    setServiceType(item);
                                    setShowDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-gray-100"
                            >
                                <Text className="text-text-primary">
                                    {item}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            {/* ✅ NOTES (OPTIONAL) */}
            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Notes (Optional)
                </Text>

                <TextInput
                    value={notes}
                    onChangeText={(v) => {
                        logger.info("Notes changed", v);
                        setNotes(v);
                    }}
                    placeholder="Add any special instructions (optional)"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-text-primary"
                />
            </View>

        </View>
    );
}