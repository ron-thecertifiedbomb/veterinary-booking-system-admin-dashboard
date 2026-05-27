import { useState } from "react";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";

// ✅ types
type UpdateProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
};

type UpdateProfileResponse = {
  message: string;
  data: any;
};

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Updating user profile");

      // ✅ get token
      const token = await getStorageItem("access_token");
      if (!token) throw new Error("Not authenticated");

      // ✅ API call
      const response = await api<UpdateProfileResponse>("/api/vet/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.message);

      logger.info("Profile updated", {
        id: response.data?.id,
      });

      // ✅ update stored user (important)
      await setStorageItem("user", JSON.stringify(response.data));

      return response;
    } catch (err: any) {
      logger.error("Update profile failed", err);

      const errorMessage = err?.message || "Failed to update profile";
      setError(errorMessage);


      return null;
    } finally {
      setLoading(false);
      logger.info("Update profile completed");
    }
  };

  return {
    updateProfile,
    loading,
    error,
    message,
  };
}
