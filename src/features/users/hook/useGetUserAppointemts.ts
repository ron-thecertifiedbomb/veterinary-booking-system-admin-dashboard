import { useState } from "react";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import { GetUserAppointmentsResponse } from "@/features/users/types";
import { Appointment } from "@/features/appointment/types";

export function useGetUserAppointments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async (): Promise<Appointment[] | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Fetching user appointments");

      // ✅ 1. READ FROM CACHE FIRST
      const stored = await getStorageItem("appointments");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
          logger.info("Loaded appointments from cache ✅");
        }
      }

      // ✅ 2. get token
      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // ✅ 3. FETCH FROM API
      const response = await api<GetUserAppointmentsResponse>(
        "/api/vet/users/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const safeData = Array.isArray(response.data) ? response.data : [];

      // ✅ 4. UPDATE STATE
      setAppointments(safeData);
      setMessage(response.message);

      logger.info("Appointments fetched ✅", {
        message: response.message,
        count: safeData.length,
      });

      // ✅ 5. SAVE TO CACHE
      await setStorageItem("appointments", JSON.stringify(safeData));

      return safeData;
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      const errorMessage = err?.message || "Failed to fetch user appointments";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      logger.info("Fetch appointments completed");
    }
  };

  return {
    fetchAppointments,
    appointments,
    loading,
    error,
    message,
  };
}
