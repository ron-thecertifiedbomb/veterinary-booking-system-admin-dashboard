// src/app/index.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

import { Redirect } from "expo-router";
import { Platform } from "react-native";


export default function Index() {
  const { loading, accessToken, user } = useAuthGuard();

  if (loading) {
    return <Loader fullScreen />;
  }

  // ✅ admin routing
  if (user?.role !== "ADMIN") {
    return (
      <Redirect
        href={
          Platform.OS === "web"
            ? "/(admin-web)/dashboard"
            : "/(admin-app)"
        }
      />
    );
  }

  // ✅ normal user routing
  return (
    <Redirect
      href={
        Platform.OS === "web"
          ? "/(web)/home"
          : "(app)/(tabs)/home"
      }
    />
  );
}