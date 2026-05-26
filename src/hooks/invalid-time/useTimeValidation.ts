// src/hooks/useTimeValidation.ts

import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { api } from "@/utils/api";
import { logger } from "@/utils/logger";

type ServerTimeResponse = {
  message: string;
  data: {
    timestamp: number;
    iso: string;
    date?: string;
    time?: string;
  };
};

export function useTimeValidation() {
  const [invalidTime, setInvalidTime] = useState(false);

  // ✅ toggle for testing
  const DEBUG_FAKE_TIME = false;

  const validate = async () => {
    try {
      const response = await api<ServerTimeResponse>("/api/server-time");
  logger.info("useTimeValidation", {
    message:response.message,
    data:response.data
  });
      // ✅ log backend message
      // logger.info(res.message);
      const serverTime = response.data.timestamp;
      const deviceTimeRaw = Date.now();

      const deviceTime = DEBUG_FAKE_TIME
        ? deviceTimeRaw + 10 * 60 * 1000 // +10 minutes
        : deviceTimeRaw;

      // ✅ timezone (cross-platform safe)
      // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const diff = Math.abs(deviceTime - serverTime);

      // logger.info("Time comparison", {
      //   timezone,
      //   device: new Date(deviceTime).toLocaleString("en-PH", {
      //     timeZone: "Asia/Manila",
      //     dateStyle: "medium",
      //     timeStyle: "short",
      //   }),
      //   server: new Date(serverTime).toLocaleString("en-PH", {
      //     timeZone: "Asia/Manila",
      //     dateStyle: "medium",
      //     timeStyle: "short",
      //   }),
      //   diff,
      // });

      if (diff > 5 * 60 * 1000) {
        // logger.warn("Time mismatch detected 🚫", {
        //   diff,
        // });

        setInvalidTime(true);
      } else {
        logger.info("Time is valid ✅");
        setInvalidTime(false);
      }
    } catch (error) {
      // logger.error("Time validation failed", error);
    }
  };

  useEffect(() => {
    validate();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        // logger.info("App resumed → rechecking time");
        validate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return invalidTime;
}
