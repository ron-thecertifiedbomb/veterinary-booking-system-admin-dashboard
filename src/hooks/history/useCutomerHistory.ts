import { API } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

// You can adjust this interface based on your exact Prisma schema
export interface Appointment {
  id: number;
  ownerName: string;
  petName: string;
  serviceType: string;
  appointmentDate: string;
  status: string;
}

export const useCustomerHistory = (ownerName: string) => {
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    // Don't fetch if the search string is empty
    if (!ownerName || ownerName.trim() === "") {
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API}/appointments/history?ownerName=${encodeURIComponent(ownerName)}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.message || `Error: ${response.status} ${response.statusText}`,
        );
      }

      const data: Appointment[] = await response.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customer history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [ownerName]);

  // Automatically fetch history when the ownerName changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory, // Useful for Pull-to-Refresh in FlatList
  };
};
