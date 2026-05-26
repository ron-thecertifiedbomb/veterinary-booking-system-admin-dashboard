import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useLogin } from "@/features/auth/hooks/useLogin";
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

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useLogin();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleLogin = async () => {
        setEmailError(null);
        setPasswordError(null);

        let hasError = false;

        // ✅ required checks
        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        }

        // ✅ email format check
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            setEmailError("Invalid email format");
            hasError = true;
        }

        if (hasError) return;

        const response = await login({
            email,
            password,
        });


        if (!response) return;

        // ✅ wait for storage to persist
        setTimeout(() => {
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
        }, 100);

    };

    return (
        <ScreenContainer>
            <View className="flex-1 justify-center items-center">
                <View className="w-full max-w-md px-6">
                <View className="mb-8 flex justify-center items-center">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Welcome Back
                    </Text>

                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Login to continue managing your pet
                        appointments.
                    </Text>
                </View>
                <View className="gap-4">
                
<View>
    <Text className="text-sm font-medium text-text-primary mb-2">
        Email
    </Text>

    <View
        className={`rounded-2xl border px-2 py-2 ${
            emailError ? "border-red-500" : "border-border"
        }`}
    >
        <TextInput
            value={email}
            onChangeText={(text) => {
                setEmail(text);
                setEmailError(null);
            }}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="text-text-primary"
        />
    </View>

    {emailError && (
        <Text className="text-red-500 text-xs mt-2">
            {emailError}
        </Text>
    )}
</View>


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
                                placeholder="Enter your password"
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

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-black rounded-2xl py-4 items-center mt-2 active:opacity-80"
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold text-base">
                                Login
                            </Text>
                        )}
                    </Pressable>

                    <View className="mt-6 items-center">
                        <Text className="text-sm text-text-secondary">
                            Don’t have an account?
                        </Text>
                        <Pressable
                            onPress={() => router.push("/(auth)/register")}
                        >
                            <Text className="text-sm font-semibold text-secondary mt-1">
                                Register here
                            </Text>
                        </Pressable>
                    </View>
                </View>
                </View>
            </View>
        </ScreenContainer>
    );
}
