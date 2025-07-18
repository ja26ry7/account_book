import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import {
  addCustomIcon,
  createIconsTable,
  deleteIcon,
  getAllIcons,
  insertDefaultIcons,
} from '@/db/db';
import { IconItem } from '@/db/type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAppContext } from './AppProvider';

const AddCategory = () => {
  const { theme } = useAppContext();
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [iconList, setIconList] = useState<IconItem[]>();

  const data = [
    'fast-food',
    'restaurant',
    'wine',
    'cafe',
    'bag-handle',
    'balloon',
    'barbell',
    'cut',
    'game-controller',
    'cart',
    'gift',
    'musical-notes',
    'paw',
    'call',
    'receipt',
    'shirt',
    'car',
    'train',
    'airplane',
    'cash',
    'card',
    'journal',
    'wallet',
    'medkit',
  ];
  const [selectIcon, setSelectIcon] = useState(data[0]);

  const handleAdd = async () => {
    if (!label) {
      alert('請輸入類別名稱');
      return;
    }

    await addCustomIcon({ label, icon: selectIcon });
    router.back();
  };
  deleteIcon(19);

  const getList = async () => {
    const txs = await getAllIcons();
    console.log(txs);
    setIconList(txs);
  };

  useEffect(() => {
    (async () => {
      await createIconsTable();
      const imported = await AsyncStorage.getItem('importedDefaultIcon');
      if (!imported) {
        await insertDefaultIcons();
        AsyncStorage.setItem('importedDefaultIcon', 'true');
      }
      getList();
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getList();
    }, [])
  );
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedText>命名類別：</ThemedText>
          <ThemedInput
            value={label}
            onChangeText={setLabel}
            style={styles.input}
          />

          <View style={styles.list}>
            {data.map((item: any) => (
              <Pressable
                key={item}
                onPress={() => setSelectIcon(item)}
                style={({ pressed }) => [
                  {
                    backgroundColor:
                      selectIcon === item
                        ? Colors[theme].tint
                        : Colors[theme].cardBackground,
                  },
                  styles.icon,
                ]}
              >
                <Ionicons
                  name={item}
                  color={
                    selectIcon === item
                      ? Colors[theme].activeTab
                      : Colors[theme].icon
                  }
                  size={20}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              {
                marginHorizontal: 30,
                marginVertical: 20,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: Colors[theme].button,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleAdd}
          >
            <ThemedText>新增</ThemedText>
          </Pressable>

          <ThemedText>目前類別：</ThemedText>
          <ThemedView
            style={{
              padding: 5,
              marginVertical: 10,
            }}
          >
            {iconList?.map((item, index) => (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  gap: 10,
                  borderBottomColor: 'lightgray',
                  borderBottomWidth:
                    iconList.length !== index + 1 ? 1 : undefined,
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  color={Colors[theme].icon}
                  size={20}
                />
                <ThemedText>{item.label}</ThemedText>
              </View>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 20,
  },
  icon: {
    margin: 5,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  list: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  input: {
    padding: 8,
    marginVertical: 8,
  },
});
