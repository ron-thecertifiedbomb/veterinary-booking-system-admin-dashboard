import "@/global.css";
import { toastConfig } from "@/components/common/CustomToast/toastConfig";
import { Slot } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Slot />

      <Toast
        config={toastConfig}
        position="top"
        topOffset={500} // ✅ balanced center
      />
    </>
  );
}