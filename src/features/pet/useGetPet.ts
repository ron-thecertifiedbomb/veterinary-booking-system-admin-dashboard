import { useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";

// ✅ types
type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  weight?: number;
};

type GetPetsResponse = {
  message: string;
  data: Pet[];
};

export function useGetPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPets = async (): Promise<Pet[] | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Fetching pets");

      // ✅ 1. Load cache
      const stored = await getStorageItem("pets");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPets(parsed);
          logger.info("Loaded pets from cache");
        }
      }

      // ✅ 2. Get token
      const token = await getStorageItem("access_token");
      if (!token) throw new Error("Not authenticated");

      // ✅ 3. API call
      const response = await api<GetPetsResponse>("/api/vet/pets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
const safeData = Array.isArray(response.data) ? response.data : [];

      // ✅ 4. Update state
      setPets(safeData);
      setMessage(response.message);

      logger.info("Pets fetched", {
        count: safeData.length,
      });

      // ✅ 5. Save cache
      await setStorageItem("pets", JSON.stringify(safeData));

      return safeData;
    } catch (err: any) {
      logger.error("Fetch pets failed", err);

      const errorMessage = err?.message || "Failed to fetch pets";
      setError(errorMessage);

      Toast.show({
        type: "error",
        text1: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
      logger.info("Fetch pets completed");
    }
  };

  return {
    pets,
    fetchPets,
    loading,
    error,
    message,
  };
}
