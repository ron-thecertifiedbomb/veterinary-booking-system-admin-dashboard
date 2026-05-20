import DateSelector from "@/components/booking/DateSelector";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";

export default function Home() {
  const [date, setDate] = useState("2026-05-20");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="max-w-md mx-auto w-full px-6 py-10">
        <DateSelector
          date={date}
          onDateChange={setDate}
          onContinue={() => console.log("next")}
        />
      </View>
    </SafeAreaView>
  );
}