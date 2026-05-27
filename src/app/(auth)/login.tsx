import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useLogin } from "@/features/auth/hooks/useLogin";
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

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { login, loading } = useLogin();

    const handleLogin = async () => {
        setEmailError(null);
        setPasswordError(null);

        let hasError = false;

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setEmailError("Invalid email format");
            hasError = true;
        }

        if (hasError) return;

        const response = await login({ email, password });

        // ✅ ✅ ✅ ADD ALERT HERE
        if (!response) {
            Alert.alert(
                "Login Failed",
                "Invalid email or password. Please try again."
            );
            return;
        }

        const isWeb = Platform.OS === "web";

        Alert.alert(
            "Login Successful",
            "Welcome back!",
            [
                {
                    text: "Continue",
                    onPress: () => {
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

    };
    

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerClassName="flex-grow justify-center items-center"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full max-w-md px-6 py-8">

                        {/* HEADER */}
                        <View className="mb-8 items-center">
                            <Text className="text-3xl font-semibold text-text-primary">
                                Sign in
                            </Text>
                            <Text className="text-xs lg:text-sm text-text-secondary mt-1">
                                Login to continue managing your pet appointments.
                            </Text>
                        </View>

                        <View className="gap-4">

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
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="bg-surface rounded-2xl px-4 py-4 text-text-primary"
                                    style={
                                        Platform.OS === "web"
                                            ? ({ outlineStyle: "none" } as any)
                                            : undefined
                                    }
                                />

                                {emailError && (
                                    <Text className="text-red-500 text-xs mt-2">
                                        {emailError}
                                    </Text>
                                )}
                            </View>

                            {/* PASSWORD */}
                            <View>
                                <Text className="text-sm font-medium text-text-primary mb-2">
                                    Password
                                </Text>

                                <View className="bg-surface rounded-2xl flex-row items-center">
                                    <TextInput
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setPasswordError(null);
                                        }}
                                        placeholder="Enter your password"
                                        secureTextEntry={!isPasswordVisible}
                                        className="flex-1 px-4 py-4 text-text-primary"
                                        style={
                                            Platform.OS === "web"
                                                ? ({ outlineStyle: "none" } as any)
                                                : undefined
                                        }
                                    />

                                    <Pressable
                                        onPress={() =>
                                            setIsPasswordVisible((prev) => !prev)
                                        }
                                        className="px-4"
                                    >
                                        <Ionicons
                                            name={
                                                isPasswordVisible
                                                    ? "eye-off-outline"
                                                    : "eye-outline"
                                            }
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

                            {/* LOGIN BUTTON */}
                            <Pressable
                                onPress={handleLogin}
                                disabled={loading}
                                className="bg-black rounded-2xl py-4 items-center mt-6 active:opacity-80"
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text className="text-white font-semibold text-base">
                                        Login
                                    </Text>
                                )}
                            </Pressable>

                            {/* REGISTER */}
                            <View className="mt-2 items-center">
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
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
