import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

const ACCENT = '#00e0ff';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#000000"
      tintColor={ACCENT}
      indicatorColor="transparent"
      labelStyle={{
        selected: {
          color: '#e5e7eb',   // softer than pure white
          fontSize: 11,
          fontWeight: '600',
        },
        default: {
          color: '#52525b',   // zinc-500 (more premium gray)
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >

      {/* HOME */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf="sparkles"
          md="home"
        />
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* DEMOS */}
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon
          sf="square.grid.2x2"
          md="explore"
        />
        <NativeTabs.Trigger.Label>
          Explore
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="expertise">
        <NativeTabs.Trigger.Icon
          sf="square.grid.2x2"
          md="apps"
        />
        <NativeTabs.Trigger.Label>
          Expertise
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
