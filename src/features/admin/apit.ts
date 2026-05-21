import { Appointment } from "@/features/admin/types";
import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    logger.info("Fetching all appointments");

    const res = await fetch(`${API}/appointments`);

    if (!res.ok) {
      const err = await res.text();

      logger.error("Fetch appointments failed", {
        status: res.status,
        body: err,
      });

      throw new Error("Failed to fetch appointments");
    }

    const data = await res.json();

    logger.info("Appointments fetched", data);

    return data;
  } catch (err) {
    logger.error("Error fetching appointments", err);
    throw err;
  }
};

export const updateAppointmentStatus = async (
  id: number,
  status: Appointment["status"],
) => {
  try {
    logger.info("Updating appointment status", { id, status });

    const res = await fetch(`${API}/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.text();

      logger.error("Update appointment status failed", {
        id,
        status,
        responseStatus: res.status,
        body: err,
      });

      throw new Error("Failed to update status");
    }

    const data = await res.json();

    logger.info("Appointment status updated", data);

    return data;
  } catch (err) {
    logger.error("Error updating appointment status", {
      id,
      status,
      error: err,
    });

    throw err;
  }
};

export { Appointment };
