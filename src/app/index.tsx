// src/app/index.tsx

import { Platform } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  // ✅ temporary routing test
  const isLoggedIn = true;
  const isAdmin = false;

  // ✅ not logged in
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
            : "/(admin-app)/dashboard"
        }
      />
    );
  }

  // ✅ normal user routing
  return (
    <Redirect
      href={
        Platform.OS === "web"
          ? "/(web)/dashboard"
          : "/(app)/dashboard"
      }
    />
  );
}