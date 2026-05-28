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

      await setStorageItem("access_token", response.access_token);
      await setStorageItem("user", JSON.stringify(response.user));
      setMessage(response.message);

      return response;
    } catch (err: any) {

      const errorMessage = err?.message || "Failed to register";

      setError(errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    message,
  };
}
