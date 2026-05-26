import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { logger } from "@/utils/logger";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
    ActivityIndicator,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Registration() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ✅ error states
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const { register, loading } = useRegister();

    const handleRegister = async () => {
        logger.info("Submitting registration form");

        // ✅ reset errors
        setNameError(null);
        setEmailError(null);
        setPhoneError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        let hasError = false;

        // ✅ required fields
        if (!name) {
            setNameError("Name is required");
            hasError = true;
        }

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (!phone) {
            setPhoneError("Phone is required");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            hasError = true;
        }

        // ✅ email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setEmailError("Invalid email format");
            hasError = true;
        }

        // ✅ password match
        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        }

        if (hasError) return;

        // ✅ API call
        const response = await register({
            name,
            email,
            phone,
            password,
        });

        if (!response) return;

        const isWeb = Platform.OS === "web";

        if (response.user.role === "ADMIN") {
            router.replace(
                isWeb
                    ? "/(admin-web)/dashboard"
                    : "/(admin-app)/dashboard"
            );
            return;
        }

        router.replace(
            isWeb
                ? "/(web)/home"
                : "/(app)/home"
        );
    };

    return (
        <ScreenContainer>
            <View className="flex-1 justify-center items-center">
                <View className="w-full max-w-md px-6">

                    {/* HEADER */}
                    <View className="mb-8 items-center">
                        <Text className="text-3xl font-semibold text-text-primary">
                            Create Account
                        </Text>
                        <Text className="text-sm leading-5 text-text-secondary mt-1.5 text-center">
                            Register to start booking appointments
                            for your pets.
                        </Text>
                    </View>

                    <View className="gap-4">

                        {/* NAME */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Name
                            </Text>
                            <TextInput
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setNameError(null);
                                }}
                                placeholder="Full name"
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border ${nameError ? "border-red-500" : "border-border"
                                    }`}
                            />
                            {nameError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {nameError}
                                </Text>
                            )}
                        </View>

                        {/* EMAIL */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Email
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError(null);
                                }}
                                placeholder="Email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border ${emailError ? "border-red-500" : "border-border"
                                    }`}
                            />
                            {emailError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {emailError}
                                </Text>
                            )}
                        </View>

                        {/* PHONE */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Phone
                            </Text>
                            <TextInput
                                value={phone}

                                onChangeText={(text) => {
                                    // ✅ remove non-numeric characters
                                    const numeric = text.replace(/\D/g, "");
                                    setPhone(numeric);
                                    setPhoneError(null);
                                }}

                                placeholder="Contact number"
                                keyboardType="phone-pad"
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border ${phoneError ? "border-red-500" : "border-border"
                                    }`}
                            />
                            {phoneError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {phoneError}
                                </Text>
                            )}
                        </View>

                        {/* PASSWORD */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Password
                            </Text>
                            <TextInput
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setPasswordError(null);
                                }}
                                placeholder="Password"
                                secureTextEntry
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border ${passwordError ? "border-red-500" : "border-border"
                                    }`}
                            />
                            {passwordError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {passwordError}
                                </Text>
                            )}
                        </View>

                        {/* CONFIRM PASSWORD */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Retype Password
                            </Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setConfirmPasswordError(null);
                                }}
                                placeholder="Retype your password"
                                secureTextEntry
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border ${confirmPasswordError ? "border-red-500" : "border-border"
                                    }`}
                            />
                            {confirmPasswordError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {confirmPasswordError}
                                </Text>
                            )}
                        </View>

                        {/* BUTTON */}
                        <Pressable
                            onPress={handleRegister}
                            disabled={loading}
                            className="bg-black rounded-2xl py-4 items-center mt-2 active:opacity-80"
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white font-semibold text-base">
                                    Create Account
                                </Text>
                            )}
                        </Pressable>

                        {/* LOGIN LINK */}
                        <View className="mt-6 items-center">
                            <Text className="text-sm text-text-secondary">
                                Already have an account?
                            </Text>

                            <Pressable
                                onPress={() => router.push("/(auth)/login")}
                            >
                                <Text className="text-sm font-semibold text-secondary mt-1">
                                    Login here
                                </Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </View>
        </ScreenContainer>
    );
}