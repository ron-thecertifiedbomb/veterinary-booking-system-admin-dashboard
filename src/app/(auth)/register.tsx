import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

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

export default function Registration() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // errors
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const { register, loading } = useRegister();

    const handleRegister = async () => {
        logger.info("Submitting registration form");

        setNameError(null);
        setEmailError(null);
        setPhoneError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        let hasError = false;

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setEmailError("Invalid email format");
            hasError = true;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        }

        if (hasError) return;

        const response = await register({
            name,
            email,
            phone,
            password,
        });

        if (!response) {
            Alert.alert(
                "Registration Failed",
                "Unable to create account. Please check your details and try again."
            );
            return;
        }

        // ✅ OPTIONAL SUCCESS ALERT
        Alert.alert(
            "Success",
            "Account created successfully!",
            [
                {
                    text: "Continue",
                    onPress: () => {
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
                    },
                },
            ]
        );
    }
    const noOutline = Platform.OS === "web"
        ? ({ outlineStyle: "none" } as any)
        : undefined;

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

                            {/* HEADER */}
                            <View className="mb-8 items-center">
                                <Text className="text-3xl font-semibold text-text-primary">
                                    Create an Account
                                </Text>
                                <Text className="text-xs lg:text-sm text-text-secondary mt-1">
                                    Register to start booking appointments for your pets.
                                </Text>
                            </View>

                            <View className="gap-4">

                                {/* NAME */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Name
                                    </Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            setNameError(null);
                                        }}
                                        placeholder="Full name"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {nameError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {nameError}
                                        </Text>
                                    )}
                                </View>

                                {/* EMAIL */}
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
                                        placeholder="Email address"
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

                                {/* PHONE */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Phone
                                    </Text>
                                    <TextInput
                                        value={phone}
                                        onChangeText={(text) => {
                                            const numeric = text.replace(/\D/g, "");
                                            setPhone(numeric);
                                            setPhoneError(null);
                                        }}
                                        placeholder="Contact number"
                                        keyboardType="phone-pad"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {phoneError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {phoneError}
                                        </Text>
                                    )}
                                </View>

                                {/* PASSWORD */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Password
                                    </Text>

                                    <View className="bg-surface rounded-2xl flex-row items-center">
                                        <TextInput
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                setPasswordError(null);
                                            }}
                                            placeholder="Password"
                                            secureTextEntry={!isPasswordVisible}
                                            className="flex-1 px-4 py-4"
                                            style={noOutline}
                                        />

                                        <Pressable
                                            onPress={() => setIsPasswordVisible(p => !p)}
                                            className="px-4"
                                        >
                                            <Ionicons
                                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                                size={22}
                                                color="#6b7280"
                                            />
                                        </Pressable>
                                    </View>

                                    {passwordError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {passwordError}
                                        </Text>
                                    )}
                                </View>

                                {/* CONFIRM PASSWORD */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Retype Password
                                    </Text>

                                    <View className="bg-surface rounded-2xl flex-row items-center">
                                        <TextInput
                                            value={confirmPassword}
                                            onChangeText={(text) => {
                                                setConfirmPassword(text);
                                                setConfirmPasswordError(null);
                                            }}
                                            placeholder="Retype your password"
                                            secureTextEntry={!isConfirmPasswordVisible}
                                            className="flex-1 px-4 py-4"
                                            style={noOutline}
                                        />

                                        <Pressable
                                            onPress={() => setIsConfirmPasswordVisible(p => !p)}
                                            className="px-4"
                                        >
                                            <Ionicons
                                                name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                                size={22}
                                                color="#6b7280"
                                            />
                                        </Pressable>
                                    </View>

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
                                    className="bg-black rounded-2xl py-4 items-center mt-6 active:opacity-80"
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
                                <View className="mt-2 items-center">
                                    <Text className="text-sm text-text-secondary">
                                        Already have an account?
                                    </Text>

                                    <Pressable onPress={() => router.push("/(auth)/login")}>
                                        <Text className="text-sm font-semibold text-secondary mt-1">
                                            Sign in here
                                        </Text>
                                    </Pressable>
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
