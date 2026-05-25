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

    const handleLogin = async () => {
        logger.info("Submitting login form");
        const response = await login({
            email,
            password,
        });
        if (!response) {
            logger.warn("Login request returned null");
            return;
        }
        logger.info(
            "Login successful",
            response.user,
        );
        logger.info("Access token received");
        const isWeb = Platform.OS === "web";
        if (response.user.role === "ADMIN") {
            router.replace(
                isWeb
                    ? "/(admin-web)/dashboard"
                    : "/(admin-app)/dashboard",
            );
            return;
        }
        router.replace(
            isWeb
                ? "/(web)/home"
                : "/(app)/home",
        );
    };

    return (
        <ScreenContainer>
            <>
                <View className="mb-8">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Welcome Back
                    </Text>

                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Login to continue managing your pet
                        appointments.
                    </Text>
                </View>

                <View className="bg-surface border border-border rounded-2xl px-5 py-5 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                        Account Access
                    </Text>

                    <Text className="text-base font-semibold text-text-primary">
                        Secure Login Portal
                    </Text>
                </View>

                <View className="gap-4">
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Email
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Password
                        </Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            autoCorrect={false}
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
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
                </View>
            </>
        </ScreenContainer>
    );
}
