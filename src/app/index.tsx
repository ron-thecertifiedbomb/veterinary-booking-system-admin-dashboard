import { StatusBar } from "expo-status-bar";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ACCENT = "#00e0ff";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <StatusBar style="light" />
      {/* Top Micro Label */}
      <Text
        className="text-[10px] tracking-[3px] mb-6"
        style={{ color: ACCENT }}
      >
        AI • AUTOMATION • SYSTEMS
      </Text>

      {/* Logo */}
      {/* <Image
        source={require('@/assets/images/rondevlogo.png')}
        className="w-20 h-20 mb-6"
        resizeMode="contain"
      /> */}

      {/* Headline (dominant like your reference) */}
      <Text className="text-[36px] leading-tight font-black text-neutral-200">
        Building scalable{"\n"}
        software systems{"\n"}
        <Text className="text-neutral-400">
          for real-world businesses.
        </Text>
      </Text>

      {/* Description */}
      <Text className="text-neutral-500 mt-6 text-sm leading-relaxed">
        Rondev helps businesses automate operations, manage bookings,
        and streamline workflows using modern digital systems and
        AI-assisted tools — built to scale with your growth.
      </Text>

      {/* Feature Strip (subtle, not pills anymore) */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-2 mt-6">
        {[
          "Bookings",
          "Automation",
          "AI Workflows",
          "Dashboards",
        ].map((item) => (
          <Text
            key={item}
            className="text-xs text-neutral-600"
          >
            {item}
          </Text>
        ))}
      </View>

      {/* CTAs */}
      <View className="flex-row items-center gap-3 mt-10">

        {/* Primary */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ backgroundColor: ACCENT }}
          className="px-5 py-4 rounded-xl"
        >
          <Text className="text-black font-semibold text-xs tracking-wide">
            Initiate Project Request
          </Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-neutral-500 text-xs">
            View demos →
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}