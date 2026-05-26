// src/app/_layout.tsx
import "../global.css";
import { useTimeValidation } from "@/hooks/invalid-time/useTimeValidation";
import { Slot, Redirect, usePathname } from "expo-router";
import Toast from "react-native-toast-message";


export default function RootLayout() {
  const invalidTime = useTimeValidation();
  const pathname = usePathname();


  if (invalidTime && pathname !== "/invalid-time") {
    return <Redirect href="/invalid-time" />;
  }

  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}
