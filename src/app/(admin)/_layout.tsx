import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "@/components/web/NavBar";


export default function AdminLayout() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <Navbar />

            <Slot />

        </SafeAreaView>
    );
}