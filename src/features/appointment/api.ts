import { SlotsResponse } from "@/features/appointment/types";
import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";

export const getSlots = async (date: string): Promise<SlotsResponse> => {
  try {
    logger.info("Fetching slots", { date });

    const res = await fetch(`${API}/api/vet/appointments/slots?date=${date}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      logger.error("Slots fetch failed (status)", res.status);
      throw new Error("Failed to fetch slots");
    }

    const data = await res.json();

    logger.info("Slots fetched", data);

    return data;
  } catch (error) {
    logger.error("Error loading slots", error);
    throw new Error("Error loading slots");
  }
};

export const createAppoinment = async (payload: {
  ownerName: string;
  petName: string;
  serviceType: string;
  date: string;
  time: string;
}) => {
  try {
    logger.info("Creating appointment", payload);

    const res = await fetch(`${API}/api/vet/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerName: payload.ownerName,
        petName: payload.petName,
        serviceType: payload.serviceType,
        date: payload.date,
        time: payload.time,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      logger.error("Booking failed (status)", {
        status: res.status,
        body: errorBody,
      });

      throw new Error("Booking failed");
    }

    const data = await res.json();
    logger.info("Booking success", data);

    return data;
  } catch (error) {
    logger.error("Error creating booking", error);
    throw new Error("Error creating booking");
  }
};
