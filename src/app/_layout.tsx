import "@/global.css";
import { toastConfig } from "@/components/common/CustomToast/toastConfig";
import { Slot, useRouter, usePathname } from "expo-router";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { useTimeValidation } from "@/hooks/invalid-time/useTimeValidation";

export default function RootLayout() {
  const invalidTime = useTimeValidation();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (invalidTime && pathname !== "/invalid-time") {
      router.replace("/invalid-time");
    }

    // ✅ Optional: allow recovery when fixed
    if (!invalidTime && pathname === "/invalid-time") {
      router.replace("/");
    }
  }, [invalidTime, pathname]);

  return (
    <>
      <Slot />

      <Toast
        config={toastConfig}
        position="top"
        topOffset={500}
      />
    </>
  );
}