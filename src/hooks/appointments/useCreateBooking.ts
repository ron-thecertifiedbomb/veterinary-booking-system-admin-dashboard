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

      const res = await fetch(`${API}/api/vetappointments`, {
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

        let errorMessage = "An unexpected error occurred during booking.";
        try {
          const parsed = JSON.parse(errorBody);
          if (parsed.message) errorMessage = parsed.message;
        } catch {
          // Fallback for non-JSON error bodies
          if (errorBody) errorMessage = errorBody;
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const data = (await res.json()) as { bookingCode: string };

      const responseWithPayload: BookingResponse = {
        ...payload,
        bookingCode: data.bookingCode,
      };

      logger.info("Booking success", responseWithPayload);

      setSuccess(true);

      return responseWithPayload;
    } catch (err: any) {
      // This will catch both the fetch error and the re-thrown error from the !res.ok block
      logger.error("Error creating booking", err);
      // Only set a generic network error if a specific one from the server wasn't already set
      if (!error) {
        setError(
          err.message ||
            "Could not connect to the server to create the booking.",
        );
      }
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
