
import { useNetworkGuard } from '@/components/NetworkGuard/useNetworkGuard';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export interface NetworkGuardProps {
    children: React.ReactNode;
    /** The URL of the NestJS server-time endpoint */
    apiUrl?: string; // This prop is passed to the useNetworkGuard hook
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

export const NetworkGuard: React.FC<NetworkGuardProps> = (props) => {
    const { children, allowOffline = false } = props;
    const { status, errorDetails, verifyConnection, setStatus } = useNetworkGuard(props);

    if (status === 'connected' || status === 'offline-bypassed') {
        return <>{children}</>;
    }

    return (
        <View className="flex-1 items-center justify-center bg-white p-4">
            {status === 'verifying' && (
                <ActivityIndicator size="large" color="#d4d4d8" />
            )}

            {status === 'offline' && (
                <View className="bg-white border border-x-zinc-500 rounded-2xl p-8 w-full max-w-[400px] items-center boxShadow-2xl">
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
                <View className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-[400px] items-center boxShadow-2xl">
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
