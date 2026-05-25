import { Slot } from "@/features/appointment/types";
import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";
import { checkSystemTime } from "@/utils/time/checkSystemTime";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const useBookingBootstrap = (date: string) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  const lastFetchedDate = useRef<string | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const fetchSlots = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      logger.info("Bootstrap start", { date });

      const res = await fetch(`${API}/appointments/slots?date=${date}`);

      if (!res.ok) {
        const errorBody = await res.text();

        logger.error("Bootstrap fetch failed", {
          status: res.status,
          body: errorBody,
        });

        let errorMessage = "Failed to fetch slots";
        try {
          const parsed = JSON.parse(errorBody);
          if (parsed.message) errorMessage = parsed.message;
        } catch {
          if (errorBody) errorMessage = errorBody;
        }

        throw new Error(errorMessage);
      }

      const data = await res.json();

      logger.info("Bootstrap data received", data);

      const fetchedSlots = Array.isArray(data.slots) ? data.slots : [];

      setSlots(fetchedSlots);

      const isMismatch = checkSystemTime(data.now);

      if (isMismatch && pathnameRef.current !== "/invalid-time") {
        router.replace("/invalid-time");
        return;
      }
    } catch (err: any) {
      logger.error("Bootstrap failed", err);
      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please check your internet connection."
          : err.message || "Failed to fetch slots",
      );
    } finally {
      setLoading(false);
    }
  }, [date, router]);

  useEffect(() => {
    if (!date) return;

    // Prevent refetching if the date hasn't changed (e.g. when switching screens)
    if (lastFetchedDate.current === date) return;

    lastFetchedDate.current = date;
    fetchSlots();
  }, [date, fetchSlots]);

  return {
    slots,
    loading,
    error,
    refreshSlots: fetchSlots,
  };
};
