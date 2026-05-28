import { GuardStatus } from "@/components/NetworkGuard/NetworkGuard";
import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

interface UseNetworkGuardProps {
  apiUrl?: string;
  maxTimeDifferenceMs?: number;
  enabled?: boolean;
  onStatusChange?: (status: GuardStatus) => void;
}

const defaultApiUrl = `${API}/api/server-time`;

export const useNetworkGuard = ({
  apiUrl = defaultApiUrl,
  maxTimeDifferenceMs = 60000,
  enabled = true,
  onStatusChange,
}: UseNetworkGuardProps) => {
  const [status, setStatus] = useState<GuardStatus>("verifying");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const appState = useRef(AppState.currentState);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
    if (onStatusChange) onStatusChange(status);
  }, [status, onStatusChange]);

  const verifyConnection = useCallback(async () => {
    setStatus("verifying");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        logger.info("useNetworkGuard logs:");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        setStatus("offline");
        setErrorDetails(`Server responded with status: ${response.status}`);
        return;
      }

      const data = await response.json();

      // The server returns a nested object like { data: { timestamp: ... } }
      const serverTimestamp = data?.data?.timestamp;
      logger.info("apiUrl:", apiUrl);
    logger.info("", data.message);

      if (typeof serverTimestamp !== "number") {
        setStatus("offline");
        setErrorDetails("Received invalid data format from the server.");
        return;
      }

      const clientTimestamp = Date.now();
      const timeDifference = Math.abs(clientTimestamp - serverTimestamp);
     logger.info("Server timestamp:", serverTimestamp);
      if (timeDifference > maxTimeDifferenceMs) {
        setStatus("time-desync");
        setErrorDetails(
          `Your device clock is out of sync. Please adjust it to match the actual time. (Difference: ${Math.round(timeDifference / 1000)}s)`,
        );
        return;
      }

      setStatus("connected");
    } catch (error: any) {
      clearTimeout(timeoutId);
      setStatus("offline");
      if (error.name === "AbortError") {
        setErrorDetails(
          `Connection timed out attempting to reach:\n${apiUrl}\n\nThe server took too long to respond.`,
        );
      } else {
        setErrorDetails(
          `Failed to connect to:\n${apiUrl}\n\nPlease check your connection or ensure your backend server is running and reachable on this network.`,
        );
      }
    }
  }, [apiUrl, maxTimeDifferenceMs]);

  useEffect(() => {
    if (!enabled) {
      setStatus("connected");
      return;
    }

    verifyConnection();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (statusRef.current !== "offline-bypassed") {
          verifyConnection();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [verifyConnection, enabled]);

  return { status, errorDetails, verifyConnection, setStatus };
};
