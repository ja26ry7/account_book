import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme].cardBackground,
          },
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
        <Stack.Screen name="addCategory" options={{ headerTitle: '新類別' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
