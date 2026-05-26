import { useState } from "react";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import Toast from "react-native-toast-message";

import { getStorageItem, removeStorageItem } from "@/features/auth/storage";

export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);

      logger.info("Logging out user");

      // ✅ get token
      const token = await getStorageItem("access_token");

      const response = await api<{
        message: string;
      }>("/api/vet/auth/logout", {
        method: "POST",
        token: token || undefined, // ✅ pass token
      });

      // ✅ clear storage properly
      await removeStorageItem("access_token");
      await removeStorageItem("user");

      logger.info("User session cleared");

      Toast.show({
        type: "success",
        text1: response.message,
      });

      return true;
    } catch (error: any) {
      logger.error("Logout failed", error);

      Toast.show({
        type: "error",
        text1: error?.message || "Logout failed",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
}
``;
