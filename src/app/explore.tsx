import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT = '#00e0ff';

const SERVICES = [
  {
    id: 1,
    title: 'Booking Systems',
    desc: 'Automate appointments and eliminate manual scheduling.',
    icon: 'calendar-outline',
  },
  {
    id: 2,
    title: 'Business Automation',
    desc: 'Streamline workflows and reduce repetitive tasks.',
    icon: 'sync-outline',
  },
  {
    id: 3,
    title: 'Custom Applications',
    desc: 'Purpose-built apps tailored to your operations.',
    icon: 'layers-outline',
  },
  {
    id: 4,
    title: 'Data & Dashboards',
    desc: 'Real-time insights into your business performance.',
    icon: 'stats-chart-outline',
  },
  {
    id: 5,
    title: 'AI Workflows',
    desc: 'Smarter processes powered by AI assistance.',
    icon: 'sparkles-outline',
  },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{
        paddingTop: Platform.OS === 'android' ? insets.top + 24 : 60,
        paddingBottom: insets.bottom + 120,
        paddingHorizontal: 24,
      }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View className="mb-12">
        <Text
          className="text-xs tracking-[3px] mb-4"
          style={{ color: ACCENT }}
        >
          SYSTEMS • AI • AUTOMATION
        </Text>

        <Text className="text-[34px] leading-tight font-black text-neutral-200">
          Scalable Digital{"\n"}
          <Text style={{ color: ACCENT }}>
            Systems for Businesses
          </Text>
        </Text>

        <Text className="text-neutral-500 mt-5 leading-relaxed text-sm">
          We design and build modern software systems that help businesses
          operate efficiently, automate processes, and grow with confidence.
        </Text>
      </View>

      {/* Services */}
      <View className="gap-y-4">
        {SERVICES.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            className="bg-[#0a0a0a] border border-[#111] rounded-2xl p-5"
          >
            <View className="flex-row items-center gap-4">

              {/* Icon */}
              <View
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={ACCENT}
                />
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text className="text-neutral-200 font-semibold text-base">
                  {item.title}
                </Text>
                <Text className="text-neutral-500 text-xs mt-1 leading-relaxed">
                  {item.desc}
                </Text>
              </View>

              {/* Arrow */}
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#333"
              />

            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View className="mt-14 border-t border-[#111] pt-10">

        <Text className="text-neutral-300 text-xl font-bold mb-3">
          Start building smarter systems
        </Text>

        <Text className="text-neutral-500 text-sm mb-8 leading-relaxed">
          Let’s discuss how we can automate and improve your operations
          using modern digital solutions.
        </Text>

        {/* Primary CTA */}
        <TouchableOpacity
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: ACCENT }}
          activeOpacity={0.85}
        >
          <Text className="text-black font-semibold tracking-wide text-sm">
            Initiate Project Request
          </Text>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity className="mt-4 items-center">
          <Text className="text-neutral-600 text-xs">
            View demo systems →
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
