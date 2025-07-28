import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useAppContext } from './AppProvider';

const SelectTheme = () => {
  const { theme, setTheme } = useAppContext();
  const colorScheme = useColorScheme() ?? 'light';
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>(
    'auto'
  );
  type themeItem = {
    label: string;
    mode: 'auto' | 'light' | 'dark';
  };

  const modes: themeItem[] = [
    {
      label: '自動',
      mode: 'auto',
    },
    {
      label: '夜間模式',
      mode: 'dark',
    },
    {
      label: '明亮模式',
      mode: 'light',
    },
  ];

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (
        savedTheme === 'light' ||
        savedTheme === 'dark' ||
        savedTheme === 'auto'
      ) {
        setCurrentTheme(savedTheme);
      }
    };

    loadTheme();
  }, []);

  const ItemSetting: React.FC<{ item: themeItem; isDivider: boolean }> = ({
    item,
    isDivider,
  }) => (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
        borderColor: Colors[theme].line,
        borderBottomWidth: isDivider ? 1 : 0,
      }}
      onPress={() => {
        if (item.mode === 'auto') {
          setTheme(colorScheme);
        } else {
          setTheme(item.mode);
        }
        AsyncStorage.setItem('theme', item.mode);
        setCurrentTheme(item.mode);
      }}
    >
      <ThemedText>{item.label}</ThemedText>
      <View style={{ flex: 1 }} />
      {item.mode === currentTheme && (
        <Ionicons name="checkmark-sharp" size={20} color={'#8a75e1'} />
      )}
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
          {modes.map((item, index) => (
            <ItemSetting
              key={item.label}
              item={item}
              isDivider={modes.length - 1 !== index}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default SelectTheme;
