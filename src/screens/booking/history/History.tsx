import { Appointment, useCustomerHistory } from "@/hooks/useCutomerHistory";
import { format } from "date-fns";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
    const [searchQuery, setSearchQuery] = useState("");
    const { history, loading, error, refetch } = useCustomerHistory(searchQuery);

    const renderCard = ({ item }: { item: Appointment }) => {
        const getStatusStyles = (status: string) => {
            switch (status.toLowerCase()) {
                case "completed":
                    return { bg: "bg-green-100 border-green-200", text: "text-green-800" };
                case "pending":
                    return { bg: "bg-yellow-100 border-yellow-200", text: "text-yellow-800" };
                case "cancelled":
                    return { bg: "bg-red-100 border-red-200", text: "text-red-800" };
                default:
                    return { bg: "bg-gray-100 border-gray-200", text: "text-gray-800" };
            }
        };

        const styles = getStatusStyles(item.status);

        return (
            <View className="bg-surface rounded-2xl p-5 mb-4 shadow-sm border border-border">
                <View className="flex-row justify-between items-start mb-3">
                    <View>
                        <Text className="text-lg font-bold text-text-primary">
                            {item.petName}
                        </Text>
                        <Text className="text-sm text-text-secondary mt-1">
                            {item.serviceType}
                        </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full border ${styles.bg}`}>
                        <Text className={`text-xs font-semibold ${styles.text}`}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View className="h-[1px] bg-border w-full my-3" />

                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-xs text-text-muted mb-1 uppercase tracking-wider">
                            Owner
                        </Text>
                        <Text className="text-sm font-medium text-text-primary">
                            {item.ownerName}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-xs text-text-muted mb-1 uppercase tracking-wider">
                            Date
                        </Text>
                        <Text className="text-sm font-medium text-text-primary">
                            {format(new Date(item.appointmentDate), "MMM dd, yyyy • hh:mm a")}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 pt-8 pb-4">
                <View className="w-full max-w-xl mx-auto px-4">
                    <Text className="text-2xl font-semibold text-text-primary">
                        History Screen
                    </Text>

                    <Text className="text-sm text-text-muted mt-1">
                        Review and manage appointment requests
                    </Text>

                    <View className="mt-6">
                        <TextInput
                            className="bg-surface border border-border rounded-xl px-4 py-3 text-text-primary mb-2"
                            placeholder="Search by owner name..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </View>

            <View className="flex-1 w-full max-w-xl mx-auto px-10">
                {error && (
                    <View className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                        <Text className="text-red-600 text-center">{error}</Text>
                    </View>
                )}

                {loading && !history.length ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#4f46e5" />
                        <Text className="text-text-secondary mt-4">Loading history...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={history}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCard}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        refreshing={loading}
                        onRefresh={refetch}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}