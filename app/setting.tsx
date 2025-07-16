import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useAppContext } from './AppProvider';

const Setting = () => {
  const { theme } = useAppContext();
  const router = useRouter();
  type SettingItem = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap | undefined;
    path: string;
    isDivider?: boolean;
  };

  const settings: SettingItem[] = [
    {
      label: '外觀',
      icon: 'moon',
      path: '/selectTheme',
      isDivider: true,
    },
    {
      label: '類別',
      icon: 'list',
      path: '/addCategory',
      isDivider: false,
    },
  ];

  const ItemSetting: React.FC<{ item: SettingItem }> = ({ item }) => (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderColor: Colors[theme].line,
        borderBottomWidth: item.isDivider ? 1 : 0,
      }}
      onPress={() => router.navigate(item.path as any)}
    >
      <Ionicons name={item.icon} size={20} color={Colors[theme].icon} />
      <ThemedText>{item.label}</ThemedText>
      <View style={{ flex: 1 }} />
      <Ionicons name="chevron-forward" size={20} color={Colors[theme].icon} />
    </Pressable>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView
          style={{
            padding: 5,
            borderRadius: 10,
            marginVertical: 20,
            marginHorizontal: 10,
            backgroundColor: Colors[theme].cardBackground,
          }}
        >
          {settings.map((item) => (
            <ItemSetting key={item.label} item={item} />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default Setting;
