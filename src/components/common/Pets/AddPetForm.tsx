import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useAddPet } from "@/features/pet/useAddPet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    Alert,
} from "react-native";

export default function AddPetForm() {
    const router = useRouter();
    const { addPet, loading } = useAddPet();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [weight, setWeight] = useState("");

    const [nameError, setNameError] = useState<string | null>(null);
    const [speciesError, setSpeciesError] = useState<string | null>(null);
    const params = useLocalSearchParams();





    useEffect(() => {
        const backAction = () => {
            router.replace("/pets"); // ✅ force correct screen
            return true; // ✅ prevent default behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);


    const noOutline =
        Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined;

    // ✅ Button enabled only if required fields are filled
    const isDisabled = !name || !species || loading;

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

        const response = await addPet({
            name,
            species,
            breed,
            weight: weight ? Number(weight) : undefined,
        });

        if (!response) {
            Alert.alert("Error", "Failed to create pet");
            return;
        }

        // ✅ SUCCESS ALERT WITH SERVER MESSAGE

        Alert.alert(
            "Success",
            response.message,
            [
                {
                    text: "OK",
                    onPress: () => router.replace("/pets"),
                },
            ]
        );

    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="w-full max-w-md px-6 py-8">

                            {/* ✅ HEADER */}
                            <View className="mb-8 items-center">
                                <Text className="text-3xl font-semibold text-text-primary">
                                    Add a Pet
                                </Text>
                                <Text className="text-sm text-text-secondary mt-1 text-center">
                                    Enter your pet’s details for booking appointments.
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
                                    disabled={isDisabled}
                                    className={`rounded-2xl py-4 items-center mt-6 ${isDisabled
                                            ? "bg-gray-300"
                                            : "bg-black active:opacity-80"
                                        }`}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text
                                            className={`font-semibold text-base ${isDisabled ? "text-gray-500" : "text-white"
                                                }`}
                                        >
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