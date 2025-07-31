import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Modal, Platform, Pressable, Text, View } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';

import { ThemedText } from '@/components/ThemedText';
import { deleteDB } from '@/db/db';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '../AppProvider';

export default function TabLayout() {
  const { theme, editMode, setEditMode } = useAppContext();
  const router = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);

  const selectList = [
    {
      label: '編輯',
      value: 'pencil',
      onPress: () => {
        setEditMode(true);
      },
    },
    {
      label: '設定',
      value: 'settings-outline',
      onPress: () => router.push('/setting'),
    },
    {
      label: '清除資料',
      value: 'trash',
      onPress: () => {
        Alert.alert('清除資料', '確認要重置及清除所有資料？', [
          { text: '取消', style: 'cancel' },
          {
            text: '刪除',
            onPress: () => deleteDB(),
            style: 'destructive',
          },
        ]);
      },
    },
  ];

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
                if (editMode) {
                  setEditMode(false);
                } else {
                  setModalVisible(true);
                }
              }}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              {editMode ? (
                <ThemedText style={{ marginHorizontal: 20 }}>完成</ThemedText>
              ) : (
                <Ionicons
                  name={'ellipsis-horizontal-circle-outline'}
                  color={Colors[theme].icon}
                  size={25}
                  style={{ marginHorizontal: 20 }}
                />
              )}

              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => setModalVisible(false)}
                >
                  <View
                    style={{
                      minWidth: 100,
                      backgroundColor: Colors[theme].cardBackground,
                      borderRadius: 5,
                      paddingVertical: 5,
                      position: 'absolute',
                      top: 100,
                      right: 10,
                      shadowColor: 'gray',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    {selectList.map((item, index) => (
                      <Pressable
                        key={item.value}
                        onPress={() => {
                          item.onPress();
                          setModalVisible(false);
                        }}
                        style={({ pressed }) => [
                          {
                            opacity: pressed ? 0.5 : 1,
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderColor: Colors[theme].line,
                          },
                        ]}
                      >
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Ionicons
                            name={item.value as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={Colors[theme].icon}
                          />
                          <Text
                            style={{
                              marginHorizontal: 10,
                              color: Colors[theme].text,
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </Pressable>
              </Modal>
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
