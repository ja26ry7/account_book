import { DropdownItem, Option } from '@/components/DropdownItem';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import {
  addTransaction,
  deleteTransaction,
  getAllIcons,
  updateTransaction,
} from '@/db/db';
import { IconItem } from '@/db/type';
import { Button } from '@expo/ui/swift-ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useAppContext } from './AppProvider';

const EditTransaction = () => {
  const { theme } = useAppContext();
  const router = useRouter();

  const {
    originalType,
    originalAmount,
    originalRemark,
    originalTitle,
    originalIcon,
    originalColor,
    originalDate,
    id,
  } = useLocalSearchParams();

  const toStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) return param[0] ?? '';
    return param ?? '';
  };
  const parseToDate = (input: unknown): Date => {
    if (input instanceof Date) return input;
    if (typeof input === 'string' && !isNaN(Date.parse(input)))
      return new Date(input);
    return new Date();
  };

  const [type, setType] = useState<'income' | 'expense'>(
    originalType === 'income' ? 'income' : 'expense'
  );
  const [amount, setAmount] = useState(toStringParam(originalAmount));
  const [remark, setRemark] = useState(toStringParam(originalRemark));
  const [icon, setIcon] = useState<Option>({
    label: toStringParam(originalTitle),
    value: (toStringParam(originalIcon) || 'link') as Option['value'],
    color: toStringParam(originalColor),
  });

  const [date, setDate] = useState<Date>(parseToDate(originalDate));
  const [iconList, setIconList] = useState<IconItem[]>();

  const handleEdit = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('請輸入有效金額');
      return;
    }
    if (!icon.label) {
      alert('請選擇類別');
      return;
    }

    const data = {
      type,
      title: icon.label,
      amount: numericAmount,
      remark,
      icon: icon.value,
      color: icon.color,
      date,
    };
    console.log(data);
    if (id) {
      await updateTransaction({
        id: Number(id),
        ...data,
      });
    } else {
      await addTransaction(data);
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert('確認', '確認要刪除？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: () => {
          deleteTransaction(Number(id)).then(() => {
            router.back();
          });
        },
        style: 'destructive',
      },
    ]);
  };

  type TypeItem = {
    label: string;
    value: 'income' | 'expense';
  };

  const typeItem: TypeItem[] = [
    { label: '支出', value: 'expense' },
    { label: '收入', value: 'income' },
  ];

  const getList = async () => {
    const txs = await getAllIcons();
    console.log(txs);
    setIconList(txs);
  };

  useFocusEffect(
    useCallback(() => {
      getList();
    }, [])
  );
  return (
    <ThemedView style={styles.container}>
      <SegmentedControl
        values={typeItem.map((e) => e.label)}
        selectedIndex={typeItem.map((e) => e.value).indexOf(type)}
        onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
          setType(typeItem[selectedSegmentIndex].value);
        }}
        style={{
          marginVertical: 20,
          borderRadius: 5,
        }}
        backgroundColor={Colors[theme].background}
        tintColor={Colors[theme].activeTab}
        fontStyle={{ color: Colors[theme].text }}
        activeFontStyle={{ color: Colors[theme].tint }}
      />

      <ThemedText>金額：</ThemedText>
      <ThemedInput
        value={amount.replace(/[^0-9]/g, '')}
        onChangeText={setAmount}
        placeholder="請輸入金額"
        keyboardType="numeric"
        style={styles.input}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <ThemedText>類別：</ThemedText>
        <Button onPress={() => router.navigate('./addCategory')}>新增</Button>
      </View>
      <DropdownItem
        data={
          iconList?.map((e) => ({
            label: e.label,
            value: e.icon,
            color: e.color,
          })) as Option[]
        }
        icon={icon}
        setIcon={setIcon}
      />

      <ThemedText>備註：</ThemedText>
      <ThemedInput
        value={remark}
        onChangeText={setRemark}
        placeholder="請輸入備註"
        style={styles.input}
      />

      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          alignItems: 'center',
        }}
      >
        <ThemedText>日期：</ThemedText>
        <DateTimePicker
          themeVariant={theme}
          value={date}
          mode="date"
          is24Hour={true}
          locale={'zh-tw'}
          display={'default'}
          onChange={(_, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
        />

        <DateTimePicker
          themeVariant={theme}
          value={date}
          mode="time"
          is24Hour={true}
          locale={'zh-tw'}
          display={'default'}
          onChange={(_, selectedTime) => {
            if (selectedTime) setDate(selectedTime);
          }}
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            marginTop: 20,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: Colors[theme].button,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleEdit}
      >
        <ThemedText>{id ? '儲存' : '新增'}</ThemedText>
      </Pressable>
      {id && (
        <Pressable
          style={({ pressed }) => [
            {
              marginTop: 20,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: Colors[theme].delete,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleDelete}
        >
          <ThemedText lightColor="white">刪除</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  input: {
    padding: 8,
    marginVertical: 8,
  },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default EditTransaction;
