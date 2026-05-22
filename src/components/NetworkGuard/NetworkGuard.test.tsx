import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { NetworkGuard } from "./NetworkGuard";

// Mock global fetch
global.fetch = jest.fn();

// Polyfill AbortController for the Jest Node environment if it doesn't exist
if (!global.AbortController) {
  (global as any).AbortController = class {
    abort = jest.fn();
    signal = {};
  };
}

describe("NetworkGuard", () => {
  const mockDateNow = 1700000000000; // Mock current timestamp

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(mockDateNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render children immediately if enabled is false", () => {
    const { getByText } = render(
      <NetworkGuard enabled={false}>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    // fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
    expect(getByText("Protected Content")).toBeTruthy();
  });

  it("should initially show a verifying state, then children on successful connection", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ timestamp: mockDateNow }),
    });

    const { getByText, queryByText } = render(
      <NetworkGuard>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    // While loading, the content shouldn't be rendered yet
    expect(queryByText("Protected Content")).toBeNull();

    // Wait for the fetch to complete and children to mount
    await waitFor(() => {
      expect(getByText("Protected Content")).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should display 'Connection Failed' if fetch throws an error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { getByText, queryByText } = render(
      <NetworkGuard>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    await waitFor(() => {
      expect(getByText("Connection Failed")).toBeTruthy();
    });
    expect(queryByText("Protected Content")).toBeNull();
  });

  it("should display 'Connection Failed' if server response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { getByText } = render(
      <NetworkGuard>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    await waitFor(() => {
      expect(getByText("Connection Failed")).toBeTruthy();
    });
  });

  it("should display 'Time Sync Error' if device time differs too much from server time", async () => {
    // Max diff is 60000ms. We mock server time to be 120000ms behind.
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ timestamp: mockDateNow - 120000 }),
    });

    const { getByText } = render(
      <NetworkGuard maxTimeDifferenceMs={60000}>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    await waitFor(() => {
      expect(getByText("Time Sync Error")).toBeTruthy();
      // Wait to see if error details display the calculated offset correctly
      expect(
        getByText(
          "Your device clock is out of sync. Please adjust it to match the actual time. (Difference: 120s)"
        )
      ).toBeTruthy();
    });
  });

  it("should allow bypassing the offline check when allowOffline is true", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { getByText } = render(
      <NetworkGuard allowOffline={true}>
        <Text>Protected Content</Text>
      </NetworkGuard>
    );

    await waitFor(() => {
      expect(getByText("Connection Failed")).toBeTruthy();
      expect(getByText("Continue Offline")).toBeTruthy();
    });

    // Simulate pressing the bypass button
    fireEvent.press(getByText("Continue Offline"));

    await waitFor(() => {
      expect(getByText("Protected Content")).toBeTruthy();
    });
  });
});