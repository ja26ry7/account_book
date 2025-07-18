import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';

import { useColorScheme } from '@/hooks/useColorScheme.web';
import AppProvider from './AppProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(
          savedTheme === 'auto' ? colorScheme : (savedTheme as 'light' | 'dark')
        );
      }
    };
    loadTheme();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider theme={theme} setTheme={setTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors[theme].cardBackground,
            },
            headerTintColor: Colors[theme].text,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, headerTitle: '帳本' }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="editTransaction"
            options={{ headerTitle: '編輯項目' }}
          />
          <Stack.Screen
            name="addCategory"
            options={{ headerTitle: '新類別' }}
          />
          <Stack.Screen name="setting" options={{ headerTitle: '設定' }} />
          <Stack.Screen name="selectTheme" options={{ headerTitle: '外觀' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </AppProvider>
    </ThemeProvider>
  );
}
