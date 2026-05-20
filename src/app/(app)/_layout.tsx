import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {
    if (Platform.OS === "web") {

        return <Redirect href="/(web)/home" />;
        // ✅ block tabs on web
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" />
            <Tabs.Screen name="booking" />
        </Tabs>
    );


}
