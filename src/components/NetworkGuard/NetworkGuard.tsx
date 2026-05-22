import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, Text, TouchableOpacity, View } from 'react-native';

interface NetworkGuardProps {
    children: React.ReactNode;
    /** The URL of the NestJS server-time endpoint */
    apiUrl?: string;
    /** Maximum allowed time difference in milliseconds (default: 60000ms / 1 minute) */
    maxTimeDifferenceMs?: number;
    /** Whether to run the checks at all. Defaults to true. */
    enabled?: boolean;
    /** Allow users to bypass the block and use the app offline */
    allowOffline?: boolean;
    /** Callback fired whenever the internal status changes */
    onStatusChange?: (status: GuardStatus) => void;
}

export type GuardStatus = 'verifying' | 'connected' | 'offline' | 'time-desync' | 'offline-bypassed';

const getBaseUrl = () => {
    const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
    return (
        env.EXPO_PUBLIC_API_URL ||
        env.REACT_APP_API_URL ||
        env.NEXT_PUBLIC_API_URL ||
        (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.100.43:3000')
    );
};

const defaultApiUrl = `${getBaseUrl().replace(/\/$/, '')}/api/server-time`;

export const NetworkGuard: React.FC<NetworkGuardProps> = ({
    children,
    apiUrl = defaultApiUrl,
    maxTimeDifferenceMs = 60000,
    enabled = true,
    allowOffline = false,
    onStatusChange,
}) => {
    const [status, setStatus] = useState<GuardStatus>('verifying');
    const [errorDetails, setErrorDetails] = useState<string>('');
    const appState = useRef(AppState.currentState);
    const statusRef = useRef(status);

    useEffect(() => {
        statusRef.current = status;
        if (onStatusChange) onStatusChange(status);
    }, [status, onStatusChange]);

    const verifyConnection = useCallback(async () => {
        setStatus('verifying');

        // Abort controller prevents fetch from hanging forever on bad connections
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                setStatus('offline');
                setErrorDetails(`Server responded with status: ${response.status}`);
                return;
            }

            const data = await response.json();

            if (!data || !data.timestamp) {
                setStatus('offline');
                setErrorDetails('Received invalid data format from the server.');
                return;
            }

            // Time validation check
            const clientTimestamp = Date.now();
            const timeDifference = Math.abs(clientTimestamp - data.timestamp);

            if (timeDifference > maxTimeDifferenceMs) {
                setStatus('time-desync');
                setErrorDetails(
                    `Your device clock is out of sync. Please adjust it to match the actual time. (Difference: ${Math.round(timeDifference / 1000)}s)`
                );
                return;
            }

            // All checks passed!
            setStatus('connected');
        } catch (error: any) {
            clearTimeout(timeoutId);
            setStatus('offline');
            if (error.name === 'AbortError') {
                setErrorDetails(`Connection timed out attempting to reach:\n${apiUrl}\n\nThe server took too long to respond.`);
            } else {
                setErrorDetails(`Failed to connect to:\n${apiUrl}\n\nPlease check your connection or ensure your backend server is running and reachable on this network.`);
            }
        }
    }, [apiUrl, maxTimeDifferenceMs]);

    useEffect(() => {
        if (!enabled) {
            setStatus('connected');
            return;
        }

        verifyConnection();

        // Listen for the app coming back to the foreground
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // Automatically re-verify when the user opens the app again, 
                // unless they explicitly bypassed the offline block
                if (statusRef.current !== 'offline-bypassed') {
                    verifyConnection();
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [verifyConnection, enabled]);

    if (status === 'connected' || status === 'offline-bypassed') {
        return <>{children}</>;
    }

    return (
        <View className="flex-1 items-center justify-center bg-white p-4">
            {status === 'verifying' && (
                <ActivityIndicator size="large" color="#d4d4d8" />
            )}

            {status === 'offline' && (
                <View className="bg-white border border-x-zinc-500 rounded-2xl p-8 w-full max-w-[400px] items-center shadow-2xl">
                    <Text className="text-[48px] mb-4">📡</Text>
                    <Text className="text-zinc-300 mt-4 mb-2 text-2xl font-bold text-center">Connection Failed</Text>
                    <Text className="text-zinc-600 mb-8 text-[15px] text-center leading-[22px]">{errorDetails}</Text>
                    <TouchableOpacity className="bg-zinc-800 border border-white/5 py-3 px-6 rounded-lg w-full mb-3" onPress={verifyConnection}>
                        <Text className="text-zinc-300 text-base font-semibold text-center">Retry Connection</Text>
                    </TouchableOpacity>
                    {allowOffline && (
                        <TouchableOpacity className="bg-transparent border border-white/5 py-3 px-6 rounded-lg w-full" onPress={() => setStatus('offline-bypassed')}>
                            <Text className="text-zinc-500 text-base font-semibold text-center">Continue Offline</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {status === 'time-desync' && (
                <View className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-[400px] items-center shadow-2xl">
                    <Text className="text-[48px] mb-4">⏳</Text>
                    <Text className="text-zinc-300 mt-4 mb-2 text-2xl font-bold text-center">Time Sync Error</Text>
                    <Text className="text-zinc-600 mb-8 text-[15px] text-center leading-[22px]">{errorDetails}</Text>
                    <TouchableOpacity className="bg-zinc-800 border border-white/5 py-3 px-6 rounded-lg w-full mb-3" onPress={verifyConnection}>
                        <Text className="text-zinc-300 text-base font-semibold text-center">I've fixed my clock</Text>
                    </TouchableOpacity>
                    {allowOffline && (
                        <TouchableOpacity className="bg-transparent border border-white/5 py-3 px-6 rounded-lg w-full" onPress={() => setStatus('offline-bypassed')}>
                            <Text className="text-zinc-500 text-base font-semibold text-center">Ignore & Continue</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
