import { DropdownItem, Option } from '@/components/DropdownItem';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAllIcons, updateTransaction } from '@/db/db';
import { IconItem } from '@/db/type';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Button, Picker } from '@expo/ui/swift-ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const EditTransaction = () => {
  // const realm = useRealm();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const {
    originalType,
    originalAmount,
    originalRemark,
    originalTitle,
    originalIcon,
    originalDate,
    id,
  } = useLocalSearchParams();

  const toStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) return param[0] ?? '';
    return param ?? '';
  };
  const parseToDate = (input: unknown): Date => {
    console.log(input);
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
  });

  const [date, setDate] = useState<Date>(parseToDate(originalDate));
  // const [time, setTime] = useState<Date>(parseToDate(originalDate));
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

    await updateTransaction({
      id: Number(id),
      type,
      title: icon.label,
      amount: numericAmount,
      remark,
      icon: icon.value,
      date,
    });
    router.back();
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
      <Picker
        style={{ marginVertical: 20 }}
        options={typeItem.map((e) => e.label)}
        selectedIndex={typeItem.map((e) => e.value).indexOf(type)}
        onOptionSelected={({ nativeEvent: { index } }) => {
          setType(typeItem[index].value);
        }}
        variant="segmented"
      />
      <ThemedText>金額：</ThemedText>
      <ThemedInput
        value={amount}
        onChangeText={setAmount}
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
          iconList?.map((e) => ({ label: e.label, value: e.icon })) as Option[]
        }
        icon={icon}
        setIcon={setIcon}
      />

      <ThemedText>備註：</ThemedText>
      <ThemedInput
        value={remark}
        onChangeText={setRemark}
        style={styles.input}
      />

      <ThemedText>日期：</ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          locale={'zh-tw'}
          display={'default'}
          onChange={(_, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
          style={{ marginVertical: 10 }}
        />

        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          locale={'zh-tw'}
          display={'default'}
          onChange={(_, selectedTime) => {
            if (selectedTime) setDate(selectedTime);
          }}
          style={{ marginVertical: 10 }}
        />
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
            backgroundColor: pressed ? '#6288e0' : '#2463f6',
          },
        ]}
        onPress={handleEdit}
      >
        <ThemedText lightColor="white">儲存</ThemedText>
      </Pressable>
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
