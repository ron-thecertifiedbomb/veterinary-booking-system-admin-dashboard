import { useCallback, useEffect, useState } from "react";


import { Appointment } from "@/features/admin/types";
import { logger } from "@/utils/logger";
import { getAppointments } from "@/features/admin/api";

export const useAppointments = () => {

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      logger.info("Loading appointments");

      const data = await getAppointments();

      setAppointments(Array.isArray(data) ? data : []);

      logger.info("Appointments loaded", {
        count: Array.isArray(data) ? data.length : 0,
      });
    } catch (err) {
      logger.error("Failed to load appointments", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);

      logger.info("Refreshing appointments");

      const data = await getAppointments();

      setAppointments(Array.isArray(data) ? data : []);

      logger.info("Appointments refreshed", {
        count: Array.isArray(data) ? data.length : 0,
      });
    } catch (err) {
      logger.error("Failed to refresh appointments", err);
      setError("Failed to refresh appointments");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    appointments,
    loading,
    refreshing,
    error,
    refresh,
  };
};



