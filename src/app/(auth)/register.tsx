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

    const { register, loading } = useRegister();

    const handleRegister = async () => {
        logger.info("Submitting registration form");

        const response = await register({
            name,
            email,
            phone,
            password,
        });

        if (!response) {
            logger.warn("Registration failed");
            return;
        }

        logger.info("Registration successful", response.user);

        // ✅ auto-route after registration
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
            <View className="flex-1 justify-center items-center">
                <View className="w-full max-w-md px-6">
                <View className="mb-8 flex justify-center items-center">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Create Account
                    </Text>
                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Register to start booking appointments
                        for your pets.
                    </Text>
                </View>
                <View className="gap-4">
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Full name"
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Email
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Phone
                        </Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Contact number"
                            keyboardType="phone-pad"
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
                            placeholder="Password"
                            secureTextEntry
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>

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