import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";
import { useState } from "react";

type Payload = {
  ownerName: string;
  petName: string;
  serviceType: string;
  date: string;
  time: string;
};

export type BookingResponse = Payload & {
  bookingCode: string;
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createBooking = async (payload: Payload): Promise<BookingResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      logger.info("Creating booking", payload);

      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.text();

        logger.error("Booking failed (status)", {
          status: res.status,
          body: errorBody,
        });

        setError("Booking failed");
        throw new Error("Booking failed");
      }

      const data = (await res.json()) as { bookingCode: string };

      const responseWithPayload: BookingResponse = {
        ...payload,
        bookingCode: data.bookingCode,
      };

      logger.info("Booking success", responseWithPayload);

      setSuccess(true);

      return responseWithPayload;
    } catch (err) {
      logger.error("Error creating booking", err);
      setError("Error creating booking");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetSuccess = () => setSuccess(false);
  return {
    createBooking,
    loading,
    error,
    success,
    resetSuccess,
  };
};
