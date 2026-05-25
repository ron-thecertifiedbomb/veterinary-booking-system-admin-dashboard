import { useBookingBootstrap } from "./useBookingBootstrap";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/home"),
}));

jest.mock("@/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("useBookingBootstrap", () => {
  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should initially set loading to true and null error", () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolving promise keeps it loading
    );

    const { result } = renderHook(() => useBookingBootstrap("2026-05-22"));

    expect(result.current.loading).toBe(true);
    expect(result.current.slots).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("should fetch slots successfully without throwing errors", async () => {
    const mockResponse = {
      slots: [{ time: "10:00 AM", available: true }],
      now: "May 22, 2026, 10:00:00 AM", // Mock server time
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBookingBootstrap("2026-05-22"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual(mockResponse.slots);
    expect(result.current.error).toBeNull();
  });

  it("should extract correct error message when the backend returns a 4xx response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: "Invalid date format." }),
    });

    const { result } = renderHook(() => useBookingBootstrap("invalid-date"));

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid date format.");
    });
  });

  it("should catch fetch exceptions and set a human-readable network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch") // Standard fetch exception format for network issue
    );

    const { result } = renderHook(() => useBookingBootstrap("2026-05-22"));

    await waitFor(() => {
      expect(result.current.error).toBe("Unable to connect to the server. Please check your internet connection.");
    });
  });
});
