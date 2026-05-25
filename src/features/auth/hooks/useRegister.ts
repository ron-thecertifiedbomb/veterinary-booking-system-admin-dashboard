// src/features/auth/hooks/useRegister.ts

import { useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { LoginResponse, RegisterPayload } from "@/features/auth/types";
import { setStorageItem } from "@/features/auth/storage";



export function useRegister() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const register = async (
    payload: RegisterPayload,
  ): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Attempting user registration", {
        email: payload.email,
      });

      const response = await api<LoginResponse>("/api/vet/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // ✅ store access token
      await setStorageItem("access_token", response.access_token);

      // ✅ store user
      await setStorageItem("user", JSON.stringify(response.user));

      logger.info("Access token stored");
      logger.info("User session stored");
      logger.info("Registration successful", response.user);
      setMessage(response.message);

 
      Toast.show({
        type: "success",
        text1: response.message,
      });

      return response;
    } catch (err: any) {
      logger.error("Registration failed", err);

      const errorMessage = err?.message || "Failed to register";

      setError(errorMessage);

      Toast.show({
        type: "error",
        text1: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);

      logger.info("Registration request completed");
    }
  };

  return {
    register,
    loading,
    error,
    message,
  };
}
