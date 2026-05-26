import { useSlots } from "@/features/appointment/hooks/useSlots";
import { logger } from "@/utils/logger";
import { useCallback, useEffect, useRef } from "react";

export const useBookingBootstrap = (date: string) => {
  const { slots, getSlots, loading, error } = useSlots();

  const lastFetchedDate = useRef<string | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      logger.info("Bootstrap start", { date });

      const res = await getSlots(date);

      if (!res) return;
    } catch (err: any) {
      logger.error("Bootstrap failed", err);
      // ✅ no error override (handled by useSlots)
    }
  }, [date, getSlots]);

  useEffect(() => {
    if (!date) return;

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
