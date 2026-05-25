import { useEffect, useState } from "react";
import { API } from "@/utils/config/api";
import { parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { logger } from "@/utils/logger";

export type Slot = {
  time: string;
  available: boolean;
};

export const useBookingSystem = (date: string) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isTimeMismatch, setIsTimeMismatch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    fetchData();
  }, [date]);

  const fetchData = async () => {
    try {
      setLoading(true);

      logger.info("Booking system fetch start", { date });

      const res = await fetch(`${API}/appointments/slots?date=${date}`);

      if (!res.ok) {
        const errorBody = await res.text();

        logger.error("Booking system fetch failed", {
          status: res.status,
          body: errorBody,
        });

        throw new Error("Failed to fetch booking system data");
      }

      const data = await res.json();

      logger.info("Booking system data received", data);

      setSlots(Array.isArray(data.slots) ? data.slots : []);

      const parsedPH = parse(data.now, "MMM d, yyyy, h:mm:ss a", new Date());

      const serverTime = fromZonedTime(parsedPH, "Asia/Manila");
      const clientPH = toZonedTime(new Date(), "Asia/Manila");

      const diffMinutes =
        Math.abs(serverTime.getTime() - clientPH.getTime()) / 60000;

      const mismatch = diffMinutes > 5;

      logger.info("Booking system time check", {
        serverNow: data.now,
        diffMinutes,
        mismatch,
      });

      setIsTimeMismatch(mismatch);
    } catch (err) {
      logger.error("Booking system fetch failed", err);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    slots,
    isTimeMismatch,
    loading,
  };
};
