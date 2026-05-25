import { useState } from "react";


import { Appointment } from "@/features/admin/types";
import { logger } from "@/utils/logger";
import { updateAppointmentStatus } from "@/features/admin/api";

export const useUpdateAppointmentStatus = () => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateStatus = async (id: number, status: Appointment["status"]) => {
    try {
      setUpdatingId(id);
      setError(null);
      setSuccess(false);

      logger.info("Updating appointment status", { id, status });

      const data = await updateAppointmentStatus(id, status);

      logger.info("Appointment status updated", data);

      setSuccess(true);

      return data;
    } catch (err) {
      logger.error("Update appointment status failed", err);
      setError("Failed to update appointment status");
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  const resetSuccess = () => setSuccess(false);
  const resetError = () => setError(null);

  return {
    updateStatus,
    updatingId,
    updating: updatingId !== null,
    error,
    success,
    resetSuccess,
    resetError,
  };
};
