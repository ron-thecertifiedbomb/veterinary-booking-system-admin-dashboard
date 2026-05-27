// src/features/appointments/hooks/useGetUserAppointments.ts

import { useState } from "react";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem } from "@/features/auth/storage";
import {  GetUserAppointmentsResponse } from "@/features/users/types";
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

      // ✅ get token
      const token = await getStorageItem("access_token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await api<GetUserAppointmentsResponse>(
        "/api/vet/users/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ store state
      setAppointments(response.data);
      setMessage(response.message);
      logger.info("Appointments fetched", {
        message: response.message,
        count: response.data.length,
      });

      return response.data;
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

