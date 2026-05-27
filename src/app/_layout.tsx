// src/app/_layout.tsx
import { NetworkGuard } from "@/components/NetworkGuard/NetworkGuard";
import "@/global.css";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    // Wrap the entire app with NetworkGuard to ensure connectivity
    // and time sync before rendering any routes.
    // allowOffline can be set to true if some parts of the app should work offline.
    //
    // If you see "Connection Failed", check that your backend server is running.
    // If you are on a physical device, you must set your computer's IP in a .env file.
    // Create a `.env` file and add:
    // EXPO_PUBLIC_API_URL=http://192.168.1.10:3000 (replace with your IP)
    <NetworkGuard allowOffline={false}>{<Slot />}</NetworkGuard>
  );
}