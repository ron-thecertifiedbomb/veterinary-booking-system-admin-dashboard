import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { View } from "react-native";
import "../global.css";

// Adjust these import paths to point to where your components actually live


export default function RootLayout() {

  return (
    <View className="flex-1">
      <AnimatedSplashOverlay />
      <AppTabs />
    </View>
  );
}
