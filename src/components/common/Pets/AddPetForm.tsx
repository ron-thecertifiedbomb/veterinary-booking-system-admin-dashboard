import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddPetForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [weight, setWeight] = useState("");

    const [nameError, setNameError] = useState<string | null>(null);
    const [speciesError, setSpeciesError] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const noOutline =
        Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined;

    const handleCreatePet = async () => {
        setNameError(null);
        setSpeciesError(null);

        let hasError = false;

        if (!name) {
            setNameError("Pet name is required");
            hasError = true;
        }

        if (!species) {
            setSpeciesError("Species is required");
            hasError = true;
        }

        if (hasError) return;

        try {
            setLoading(true);

            // ✅ later connect API here

            // fake delay
            await new Promise((res) => setTimeout(res, 800));

            router.back(); // ✅ go back after creation
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="w-full max-w-md px-6 py-8 lg:py-14">

                            {/* ✅ HEADER */}
                            <View className="mb-8 items-center">
                                <Text className="text-3xl font-semibold text-text-primary">
                                    Add a Pet
                                </Text>
                                <Text className="text-sm text-text-secondary mt-1 text-center">
                                    Enter your pet’s details to use for booking appointments.
                                </Text>
                            </View>

                            <View className="gap-4">

                                {/* ✅ PET NAME */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Pet Name
                                    </Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            setNameError(null);
                                        }}
                                        placeholder="e.g. Duff"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {nameError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {nameError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ SPECIES */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Species
                                    </Text>
                                    <TextInput
                                        value={species}
                                        onChangeText={(text) => {
                                            setSpecies(text);
                                            setSpeciesError(null);
                                        }}
                                        placeholder="Dog, Cat, etc."
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {speciesError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {speciesError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ BREED */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Breed (optional)
                                    </Text>
                                    <TextInput
                                        value={breed}
                                        onChangeText={setBreed}
                                        placeholder="e.g. Labrador"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                </View>

                                {/* ✅ WEIGHT */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Weight (kg)
                                    </Text>
                                    <TextInput
                                        value={weight}
                                        onChangeText={(text) => {
                                            const numeric = text.replace(/[^0-9.]/g, "");
                                            setWeight(numeric);
                                        }}
                                        placeholder="e.g. 12.5"
                                        keyboardType="numeric"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                </View>

                                {/* ✅ BUTTON */}
                                <Pressable
                                    onPress={handleCreatePet}
                                    disabled={loading}
                                    className="bg-black rounded-2xl py-4 items-center mt-6 active:opacity-80"
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white font-semibold text-base">
                                            Save Pet
                                        </Text>
                                    )}
                                </Pressable>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}