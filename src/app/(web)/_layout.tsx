// src/app/(web)/_layout.tsx

import { Slot, usePathname, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebUserLayout() {
  const pathname = usePathname();

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getStorageItem("access_token")
      : null;

  const storedUser =
    typeof window !== "undefined"
      ? localStorage.getStorageItem("user")
      : null;

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ✅ not authenticated
  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ NOT a USER → block access
  if (user?.role !== "USER") {
    return <Redirect href="/(admin-web)/dashboard" />;
  }

  // ✅ prevent root reroute only
  if (pathname === "/") {
    return <Redirect href="/(web)/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}