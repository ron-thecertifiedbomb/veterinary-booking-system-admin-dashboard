// src/app/index.tsx

import { getStorageItem } from "@/features/auth/storage";
import { logger } from "@/utils/logger";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

type User = {
  role: "USER" | "ADMIN";
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        logger.info("Bootstrapping auth session");

        const token = await getStorageItem("access_token");
        const storedUser = await getStorageItem("user");

        setAccessToken(token);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          logger.info("User session restored", parsedUser);
        }

        logger.info("Access token restored");
      } catch (error) {
        logger.error("Failed to restore auth session", error);
      } finally {
        setLoading(false);
        logger.info("Auth bootstrap completed");
      }
    };

    bootstrap();
  }, []);

  // ✅ loading screen
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isLoggedIn = !!accessToken;
  const isAdmin = user?.role === "ADMIN";

  // ✅ not authenticated → login
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ admin routing
  if (isAdmin) {
    return (
      <Redirect
        href={
          Platform.OS === "web"
            ? "/(admin-web)/dashboard"
            : "/(admin-app)(tabs)/dashboard"
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