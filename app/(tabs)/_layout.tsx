import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '../AppProvider';

export default function TabLayout() {
  const { theme } = useAppContext();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[theme].cardBackground,
        },
        sceneStyle: {
          backgroundColor: Colors[theme].background,
        },
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: Colors[theme].cardBackground,
          },
          default: {
            backgroundColor: Colors[theme].cardBackground,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '帳本',
          headerTitle: '帳本',
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.navigate('/setting');
              }}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <Ionicons
                name={'settings-outline'}
                color={Colors[theme].icon}
                size={25}
                style={{ marginHorizontal: 20 }}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: '統計',
          headerTitle: '統計',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.pie.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
