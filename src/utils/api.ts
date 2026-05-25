// src/utils/api.ts

import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const url = `${API}${endpoint}`;

  logger.info("API Request", {
    url,
    method: rest.method || "GET",
  });

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });

  const data = await response.json();

  logger.info("API Response", {
    status: response.status,
    endpoint,
  });

  if (!response.ok) {
    logger.error("API Error", data);
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}
