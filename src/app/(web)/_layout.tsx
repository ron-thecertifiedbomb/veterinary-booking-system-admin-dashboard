// src/app/(web)/_layout.tsx

import { Slot, usePathname, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebUserLayout() {
  const pathname = usePathname();

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  // ✅ redirect only if not authenticated
  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ prevent unnecessary reroute on refresh
  if (pathname === "/") {
    return <Redirect href="/(web)/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}