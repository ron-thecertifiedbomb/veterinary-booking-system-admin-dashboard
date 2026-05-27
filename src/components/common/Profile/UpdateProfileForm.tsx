import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";


import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { useUpdateProfile } from "@/features/users/hook/UpdateProfile";
import Loader from "@/components/common/Loader/Loader";

export default function UpdateProfileForm() {
    const router = useRouter();

    const { updateProfile, loading } = useUpdateProfile();
    const { profile, fetchUserProfile, loading: fetching } = useGetUserProfile();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    const [original, setOriginal] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const noOutline =
        Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined;

    // ✅ Fetch profile
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // ✅ Populate fields
    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setEmail(profile.email || "");
            setPhone(profile.phone || "");
        }
    }, [profile]);

    useEffect(() => {
        if (profile) {
            const userData = {
                name: profile.name || "",
                email: profile.email || "",
                phone: profile.phone || "",
            };

            setName(userData.name);
            setEmail(userData.email);
            setPhone(userData.phone);

            setOriginal(userData); // ✅ store original values
        }
    }, [profile]);
    const hasChanges =
        name !== original.name ||
        email !== original.email ||
        phone !== original.phone;

    const isDisabled =
        !name || !email || !hasChanges || loading;

    // ✅ Submit handler
    const handleUpdateProfile = async () => {
        setNameError(null);
        setEmailError(null);

        let hasError = false;

        if (!name) {
            setNameError("Name is required");
            hasError = true;
        }

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (hasError) return;

        const response = await updateProfile({
            name,
            email,
            phone,
        });

        if (!response) {
            Alert.alert("Error", "Failed to update profile");
            return;
        }

        // ✅ SUCCESS ALERT

        Alert.alert(
            "Success",
            response.message,
            [
                {
                    text: "OK",
                    onPress: () => router.replace("/profile"),
                },
            ]
        );

    };

    // ✅ Loader while fetching initial profile
    if (fetching) {
        return (
           <Loader fullScreen />
        );
    }

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
                                    Edit Profile
                                </Text>
                                <Text className="text-sm text-text-secondary mt-1 text-center">
                                    Update your account information.
                                </Text>
                            </View>

                            <View className="gap-4">

                                {/* ✅ NAME */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Full Name
                                    </Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            setNameError(null);
                                        }}
                                        placeholder="e.g. John Doe"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {nameError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {nameError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ EMAIL */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Email
                                    </Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            setEmailError(null);
                                        }}
                                        placeholder="e.g. john@email.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {emailError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {emailError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ PHONE */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Phone (optional)
                                    </Text>
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="e.g. 09123456789"
                                        keyboardType="phone-pad"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                </View>

                                {/* ✅ BUTTON */}
                                <Pressable
                                    onPress={handleUpdateProfile}
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
                                            Save Changes
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