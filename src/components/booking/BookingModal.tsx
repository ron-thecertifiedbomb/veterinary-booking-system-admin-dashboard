import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import BookingForm from "@/components/booking/BookingForm";
import { Slot } from "@/features/appointment/types";
import { formatTime } from "@/utils/date";
import Loader from "@/components/common/Loader/Loader";
import { formatSlotTime } from "@/utils/formatter";

type Props = {
    visible: boolean;
    slots: Slot[];
    checking: boolean;
    creating: boolean;
    error?: string | null;
    onClose: () => void;
    onSubmit: (data: {
        petName: string;
        serviceType: string;
        time: string;
        notes?: string;
    }) => Promise<void> | void;

};

export default function BookingModal({
    visible,
    slots = [],
    checking,
    creating,
    error,
    onClose,
    onSubmit,
}: Props) {

    const [petName, setPetName] = useState("");
    const [serviceType, setServiceType] = useState("Checkup");
    const [selectedTime, setSelectedTime] = useState("");
    const [notes, setNotes] = useState("");
    // ✅ only use available slots
    const availableSlots = slots.filter((slot) => slot.available);
    const hasAvailableSlots = availableSlots.length > 0;

    // ✅ validation
    const isValid =
        petName &&
        serviceType &&
        selectedTime;

    // ✅ reset form
    const resetForm = () => {
        setPetName("");
        setServiceType("");
        setSelectedTime("");
    };

    const handleClose = () => {
        if (creating) return;

        Keyboard.dismiss();
        onClose();
        resetForm(); // ✅ reset when closing
    };

    const handleSubmit = async () => {
        if (!isValid || creating) return;

        Keyboard.dismiss();

        await onSubmit({
            petName,
            serviceType,
            time: selectedTime,
        });

        resetForm();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable
                className="flex-1 bg-black/30 justify-center items-center px-4"
                onPress={handleClose}
            >
                <Pressable
                    className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
                    onPress={(e) => e.stopPropagation()}
                >

                    {/* ✅ LOADING */}
                    {checking ? (
                        <View className="items-center py-6">
                            <Loader fullScreen={false} size="small" />
                        </View>

                    ) : error && !hasAvailableSlots ? (

                        /* ✅ CONNECTION ERROR */
                        <>
                            <Text className="text-red-600 font-semibold text-xl mb-2 text-center">
                                Connection Error
                            </Text>
                            <Text className="text-text-muted text-sm text-center mb-6">
                                {error}
                            </Text>

                            <TouchableOpacity
                                onPress={handleClose}
                                className="bg-black rounded-xl py-3"
                            >
                                <Text className="text-white text-center font-medium">
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </>

                    ) : !hasAvailableSlots ? (

                        /* ✅ NO SLOTS */
                        <>
                            <Text className="text-text-primary font-semibold text-xl mb-2 text-center">
                                No Slots Available
                            </Text>

                            <Text className="text-text-muted text-sm text-center mb-6">
                                All appointment slots are unavailable.
                                {"\n"}Please choose another date.
                            </Text>

                            <TouchableOpacity
                                onPress={handleClose}
                                className="bg-black rounded-xl py-3"
                            >
                                <Text className="text-white text-center font-medium">
                                    Choose Another Date
                                </Text>
                            </TouchableOpacity>
                        </>

                    ) : (

                        /* ✅ MAIN FORM */
                        <>
                            <Text className="text-text-primary font-semibold text-lg mb-4">
                                Complete Appointment
                            </Text>

                            {/* ✅ TIME SELECT */}
                            <Text className="text-xs text-text-muted mb-2">
                                Select Time
                            </Text>

                            <View className="bg-surface border border-border rounded-xl mb-4">
                                <Picker
                                    selectedValue={selectedTime}
                                    enabled={!creating}
                                    onValueChange={(value) => setSelectedTime(String(value))}
                                >
                                    <Picker.Item
                                        label="Select a time..."
                                        value=""
                                        color="#9CA3AF"
                                    />

                                    {availableSlots.map((slot) => (
                                        <Picker.Item
                                            key={slot.time}
                                            label={formatSlotTime(slot.time)}
                                            value={slot.time}
                                        />
                                    ))}
                                </Picker>
                            </View>
                                    
                            {/* ✅ FORM */}

                                        <BookingForm
                                            petName={petName}
                                            serviceType={serviceType}
                                            notes={notes}
                                            setPetName={setPetName}
                                            setServiceType={setServiceType}
                                            setNotes={setNotes}
                                        />


                            {/* ✅ ERROR DISPLAY */}
                            {error && (
                                <View className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                                    <Text className="text-red-600 text-sm text-center">
                                        {error}
                                    </Text>
                                </View>
                            )}

                            {/* ✅ ACTIONS */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    disabled={creating}
                                    onPress={handleClose}
                                    className="flex-1 border border-border rounded-lg py-3"
                                >
                                    <Text className="text-center text-text-secondary">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={!isValid || creating}
                                    onPress={handleSubmit}
                                    className={`flex-1 rounded-lg py-3 ${isValid && !creating
                                            ? "bg-black"
                                            : "bg-gray-400"
                                        }`}
                                >
                                    {creating ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text className="text-center text-white font-medium">
                                            Confirm
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}