import { useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { formatDate, getTodayDate } from "@/utils/date";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";
import Loader from "@/components/common/Loader/Loader";

export default function Profile() {
    const router = useRouter();

    const date = getTodayDate();
    const now = new Date();

    const { fetchUserProfile, profile, loading, error } = useGetUserProfile();
    const { logout, loading: logoutLoading } = useLogout();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // ✅ Logout with confirmation
    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: handleLogout,
                },
            ]
        );
    };

    const handleLogout = async () => {
        const success = await logout();

        if (!success) return;

        router.replace("/(auth)/login");
    };

    // ✅ Loading
    if (loading) return <Loader fullScreen />;

    // ✅ Error
    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-sm">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        My Profile
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        View and manage your account information.
                    </Text>
                </View>

                {/* ✅ DATE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today
                    </Text>

                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>

                    <Text className="text-xs text-text-secondary mt-1">
                        {now.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

                {/* ✅ PROFILE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-5">

                    {/* Name */}
                    <View className="mb-4">
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Full Name
                        </Text>
                        <Text className="text-base font-semibold text-text-primary">
                            {profile?.name || "-"}
                        </Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Email
                        </Text>
                        <Text className="text-sm text-text-primary">
                            {profile?.email || "-"}
                        </Text>
                    </View>

                    {/* Phone */}
                    <View>
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Phone
                        </Text>
                        <Text className="text-sm text-text-primary">
                            {profile?.phone || "Not provided"}
                        </Text>
                    </View>

                </View>

                {/* ✅ ACTIONS */}
                <View className="mt-6 gap-3">

                    {/* ✅ EDIT PROFILE */}
                    <Pressable
                        onPress={() => router.push("/edit-profile")}
                        className="border border-border rounded-2xl py-3 items-center bg-surface active:opacity-80"
                    >
                        <Text className="text-sm font-semibold text-text-primary">
                            Edit Profile
                        </Text>
                    </Pressable>

                    {/* ✅ LOGOUT */}
                    <Pressable
                        onPress={confirmLogout}
                        disabled={logoutLoading}
                        className="bg-black rounded-2xl py-3 items-center active:opacity-80"
                    >
                        <Text className="text-white font-semibold text-sm">
                            {logoutLoading ? "Logging out..." : "Logout"}
                        </Text>
                    </Pressable>

                </View>

            </View>
        </View>
    );
}