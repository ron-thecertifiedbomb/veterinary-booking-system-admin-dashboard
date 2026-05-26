import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { useState } from "react";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import Toast from "react-native-toast-message";

import {
  Appointment,
  CreateAppointmentApiResponse,
} from "@/features/appointment/types";

type CreateAppointmentInput = {
  petName: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
};

export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createAppointment = async (
    input: CreateAppointmentInput,
  ): Promise<Appointment> => {
    try {
      // ✅ prevent duplicate requests
      if (loading) {
        throw new Error("Request already in progress");
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      // ✅ get token
      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      // ✅ get user
      const storedUser = await getStorageItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      const userId = user?.userId || user?.id;

      if (!userId) {
        throw new Error("Invalid user session");
      }

      // ✅ payload to backend
      const payload = {
        userId,
        petName: input.petName,
        serviceType: input.serviceType,
        date: input.date,
        time: input.time,
        notes: input.notes || "",
      };

      logger.info("Creating appointment payload ✅", payload);

      // ✅ API call
      const res = await api<CreateAppointmentApiResponse>(
        "/api/vet/appointments",
        {
          method: "POST",
          body: JSON.stringify(payload),
          token,
        },
      );

      logger.info("Appointment created ✅", res.data);

      // ✅ ✅ ✅ CRITICAL: STORE SAFE DISPLAY DATA
      const enrichedAppointment = {
        ...res.data,
        date: input.date, // ✅ FIX DATE (PH-safe)
        time: input.time, // ✅ FIX TIME (slot-based)
      };

      // ✅ get existing stored appointments
      const existing = await getStorageItem("appointments");
      const parsed = existing ? JSON.parse(existing) : [];

      // ✅ prepend new appointment (latest first)
      const updated = [enrichedAppointment, ...parsed].slice(0, 20); // ✅ limit to 20

      // ✅ save back
      await setStorageItem("appointments", JSON.stringify(updated));

      logger.info("Appointment stored locally ✅");

      // ✅ success toast
      Toast.show({
        type: "success",
        text1: res.message,
      });

      setSuccess(true);

      return res.data;
    } catch (err: any) {
      logger.error("Error creating appointment", err);

      const message = err?.message || "Failed to create appointment";

      setError(message);

      // ✅ error toast
      Toast.show({
        type: "error",
        text1: message,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetSuccess = () => setSuccess(false);

  return {
    createAppointment,
    loading,
    error,
    success,
    resetSuccess,
  };
};
``;
