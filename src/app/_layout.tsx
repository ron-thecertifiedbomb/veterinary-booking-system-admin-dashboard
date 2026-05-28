// src/app/_layout.tsx

import { NetworkGuard } from "@/components/NetworkGuard/NetworkGuard";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import "@/global.css";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
      <NetworkGuard allowOffline={false}>
    <AuthProvider>
        <Slot />
     </AuthProvider>
      </NetworkGuard>
  );
}