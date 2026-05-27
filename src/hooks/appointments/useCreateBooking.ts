import { api } from "@/utils/api";
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

      const data = await api<{ bookingCode: string }>("/api/vetappointments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const responseWithPayload: BookingResponse = {
        ...payload,
        bookingCode: data.bookingCode,
      };

      logger.info("Booking success", responseWithPayload);
      setSuccess(true);
      return responseWithPayload;
    } catch (err: any) {
      const errorMessage =
        err.message || "Could not connect to the server to create the booking.";
      logger.error("Error creating booking", { error: err });
      setError(errorMessage);
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
