import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { createBooking, getSlots, Slot } from "@/features/booking/api";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Home() {
    
    const [slots, setSlots] = useState<Slot[]>([]);

    const handleBooking = async (time: string) => {
        await createBooking({
            ownerName: "Test",
            petName: "Bantay",
            serviceType: "Checkup",
            date: "2026-05-20",
            time,
        });

        loadSlots(); // refresh ✅
    };

    const loadSlots = async () => {
        const data = await getSlots("2026-05-20");
        setSlots(data);
    };

    useEffect(() => {
        loadSlots();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white p-5">
            <Text className="text-xl font-bold mb-4">
                🐾 Vet Booking
            </Text>

            {slots.map((slot) => (

                <TouchableOpacity
                    key={slot.time}
                    disabled={!slot.available}
                    onPress={() => handleBooking(slot.time)}
                    className={`p-4 mb-2 rounded-lg ${slot.available ? "bg-cyan-500" : "bg-gray-300"
                        }`}
                >
                    <Text
                        className={`text-base ${slot.available ? "text-white" : "text-gray-500"
                            }`}
                    >
                        {slot.time}
                    </Text>
                </TouchableOpacity>

            ))}
        </SafeAreaView>
    );
}
