import { act, renderHook } from "@testing-library/react-native";
import { useCreateBooking } from "./useCreateBooking";

// Mock the logger so it doesn't clutter the test output
jest.mock("@/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("useCreateBooking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading false, null error, and false success", () => {
    const { result } = renderHook(() => useCreateBooking());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it("should create a booking successfully and clear previous errors", async () => {
    const mockPayload = {
      ownerName: "John Doe",
      petName: "Buddy",
      serviceType: "Checkup",
      date: "2026-05-22",
      time: "10:00 AM",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookingCode: "ABC-123" }),
    });

    const { result } = renderHook(() => useCreateBooking());

    let response;
    await act(async () => {
      response = await result.current.createBooking(mockPayload);
    });

    expect(response).toEqual({
      ...mockPayload,
      bookingCode: "ABC-123",
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(true);
  });

  it("should handle specific API failures and parse the server JSON error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409, // Conflict
      text: async () =>
        JSON.stringify({ message: "This slot is no longer available." }),
    });

    const { result } = renderHook(() => useCreateBooking());

    await act(async () => {
      await expect(result.current.createBooking({} as any)).rejects.toThrow(
        "This slot is no longer available.",
      );
    });

    expect(result.current.error).toBe("This slot is no longer available.");
    expect(result.current.success).toBe(false);
  });

  it("should handle unexpected network disconnects gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network connection lost"),
    );

    const { result } = renderHook(() => useCreateBooking());

    await act(async () => {
      await expect(result.current.createBooking({} as any)).rejects.toThrow();
    });

    expect(result.current.error).toBe("Network connection lost");
  });
});
