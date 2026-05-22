import "../global.css";
import { Slot } from "expo-router";
import { NetworkGuard } from "@/components/NetworkGuard/NetworkGuard";

export default function RootLayout() {

  return (
    <NetworkGuard>
      <Slot />
    </NetworkGuard>
  );
}