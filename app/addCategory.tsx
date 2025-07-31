import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Popover from 'react-native-popover-view';
import { useSharedValue } from 'react-native-reanimated';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, { Panel5, PreviewText } from 'reanimated-color-picker';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ThemedInput } from '../components/ThemedInput';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import {
  addCustomIcon,
  createIconsTable,
  deleteIcon,
  getAllIcons,
  insertDefaultIcons,
} from '../db/db';
import { IconItem } from '../db/type';
import { useAppContext } from './AppProvider';

const AddCategory = () => {
  const { theme } = useAppContext();
  const router = useRouter();
  const [label, setLabel] = useState('');
  const [iconList, setIconList] = useState<IconItem[]>();
  const [editMode, setEditMode] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const iconData = [
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

  const colorData = [
    '#FF0000',
    '#FF8000',
    '#FFD306',
    '#00DB00',
    '#2894FF',
    '#0000C6',
    '#8600FF',
    '#FF60AF',
    '#9D9D9D',
  ];
  const [selectIcon, setSelectIcon] = useState(iconData[0]);
  const [selectColor, setSelectColor] = useState(colorData[0]);

  const currentColor = useSharedValue(selectColor);

  const onColorChange = (color: ColorFormatsObject) => {
    'worklet';
    currentColor.value = color.hex;
  };

  // runs on the js thread on color pick
  const onColorPick = (color: ColorFormatsObject) => {
    console.log(color.hex);
    setSelectColor(color.hex);
  };

  const handleAdd = async () => {
    if (!label) {
      alert('請輸入類別名稱');
      return;
    }

    try {
      await addCustomIcon({ label, icon: selectIcon, color: selectColor });
    } catch (error) {
      console.log(error);
      alert('類別名稱已存在');
      return;
    }

    router.back();
  };

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

          <ThemedText>圖像：</ThemedText>
          <ThemedView
            style={[
              styles.list,
              { backgroundColor: Colors[theme].cardBackground },
            ]}
          >
            {iconData.map((item: any) => (
              <Pressable
                key={item}
                onPress={() => setSelectIcon(item)}
                style={({ pressed }) => [
                  {
                    backgroundColor:
                      selectIcon === item
                        ? selectColor
                        : Colors[theme].cardBackground,
                  },
                  styles.icon,
                ]}
              >
                <Ionicons
                  name={item}
                  color={
                    selectIcon === item
                      ? Colors[theme].text
                      : Colors[theme].icon
                  }
                  size={20}
                />
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText>顏色：</ThemedText>
          <ThemedView
            style={[
              styles.list,
              { backgroundColor: Colors[theme].cardBackground },
            ]}
          >
            {colorData.map((item: any) => (
              <Pressable
                key={item}
                onPress={() => setSelectColor(item)}
                style={({ pressed }) => [
                  {
                    backgroundColor: item,
                  },
                  styles.icon,
                ]}
              >
                {selectColor === item && (
                  <Ionicons
                    name={'checkmark'}
                    color={Colors[theme].text}
                    size={25}
                  />
                )}
              </Pressable>
            ))}

            <Popover
              isVisible={showCustomColor}
              onRequestClose={() => {
                setShowCustomColor(false);
              }}
              popoverStyle={[
                styles.pickerContainer,
                { backgroundColor: Colors[theme].background },
              ]}
              backgroundStyle={{ opacity: 0 }}
              from={
                <Pressable
                  onPress={() => setShowCustomColor(true)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      opacity: pressed ? 0.8 : 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <ThemedText>自訂顏色</ThemedText>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors[theme].text}
                  />
                </Pressable>
              }
            >
              <ColorPicker
                value={selectColor}
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                onChange={onColorChange}
                onCompleteJS={onColorPick}
                style={styles.picker}
              >
                <Panel5 style={styles.panelStyle} />
                <PreviewText style={styles.previewTxt} colorFormat="hsla" />
                <Pressable
                  style={({ pressed }) => [
                    {
                      marginHorizontal: 30,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor: Colors[theme].button,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => setShowCustomColor(false)}
                >
                  <ThemedText>確認</ThemedText>
                </Pressable>
              </ColorPicker>
            </Popover>
          </ThemedView>

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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ThemedText>目前類別：</ThemedText>
            <Ionicons
              name="pencil-outline"
              size={20}
              color={Colors[theme].icon}
              onPress={() => {
                setEditMode(!editMode);
              }}
            />
          </View>

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
                {editMode && (
                  <Ionicons
                    name="remove-circle"
                    size={20}
                    color={Colors[theme].delete}
                    onPress={async () => {
                      setEditMode(false);
                      await deleteIcon(item.id);
                      getList();
                    }}
                  />
                )}
                <Ionicons
                  name={item.icon as any}
                  color={item.color || Colors[theme].icon}
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
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  list: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    padding: 8,
    marginVertical: 8,
  },
  picker: {
    gap: 20,
  },
  pickerContainer: {
    width: 200,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
    zIndex: 100,
  },
  panelStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderVerticalStyle: {
    borderRadius: 20,
    height: 300,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewStyle: {
    height: 40,
    borderRadius: 14,
  },
  previewTxt: {
    color: '#707070',
    fontFamily: 'Quicksand',
    fontSize: 13,
  },
});
