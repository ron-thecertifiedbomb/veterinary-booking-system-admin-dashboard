import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const ACCENT = '#00e0ff';

const EXPERTISE = [
    {
        title: 'End-to-End Product Engineering',
        desc: 'Designing production-grade systems across frontend, backend, infrastructure, and deployment workflows.',
        icon: 'layers-outline',
    },
    {
        title: 'Distributed Systems & Backend',
        desc: 'Scalable APIs, orchestration pipelines, and resilient backend services using modern stacks.',
        icon: 'server-outline',
    },
    {
        title: 'AI Orchestration & Automation',
        desc: 'LLM pipelines, MCP workflows, and AI-assisted automation for real-world operations.',
        icon: 'sparkles-outline',
    },
    {
        title: 'Infrastructure & Platform Engineering',
        desc: 'Dockerized environments, VPS deployment, CI/CD pipelines, and production infrastructure.',
        icon: 'hardware-chip-outline',
    },
    {
        title: 'React Native Ecosystems',
        desc: 'Cross-platform mobile systems with scalable architecture and production-ready performance.',
        icon: 'phone-portrait-outline',
    },
];

export default function ExpertiseScreen() {
    return (
        <ScrollView className="flex-1 bg-black px-6 pt-16 pb-24">
            <StatusBar style="light" />

            {/* Header */}
            <View className="mb-12">
                <Text
                    className="text-xs tracking-[3px] mb-4"
                    style={{ color: ACCENT }}
                >
                    SYSTEMS EXPERTISE
                </Text>

                <Text className="text-3xl font-black text-neutral-200 leading-tight">
                    Building Modern{"\n"}
                    Distributed Applications
                </Text>

                <Text className="text-neutral-500 mt-5 text-sm leading-relaxed">
                    Focused on scalable systems engineering, AI orchestration,
                    infrastructure automation, and production-grade application
                    ecosystems across mobile, backend, and cloud platforms.
                </Text>
            </View>

            {/* Grid Cards */}
            <View className="flex flex-col gap-5">

                {EXPERTISE.map((item, index) => (
                    <View
                        key={index}
                        className="bg-[#0a0a0a] border border-[#111] rounded-2xl p-5"
                    >
                        {/* Icon */}
                        <View
                            className="w-10 h-10 rounded-xl mb-4 items-center justify-center"
                            style={{ backgroundColor: `${ACCENT}15` }}
                        >
                            <Ionicons
                                name={item.icon as any}
                                size={18}
                                color={ACCENT}
                            />
                        </View>

                        {/* Title */}
                        <Text className="text-neutral-200 font-semibold text-base mb-2">
                            {item.title}
                        </Text>

                        {/* Description */}
                        <Text className="text-neutral-500 text-xs leading-relaxed">
                            {item.desc}
                        </Text>
                    </View>
                ))}

            </View>
        </ScrollView>
    );
}
