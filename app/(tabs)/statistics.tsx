import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { toCurrency } from '@/constants/format';
import { getStateisticsByCategory } from '@/db/db';
import { CategoryStat } from '@/db/type';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Picker } from '@expo/ui/swift-ui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const EditTransaction = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const screenWidth = Dimensions.get('window').width;

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryList, setCategoryList] = useState<CategoryStat[]>();
  type PieDataItem = {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  };
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const colors = React.useMemo(
    () => ['#FF60AF', '#2894FF', '#FFCE56', '#9F35FF', '#00CACA', '#FF9224'],
    []
  );
  type TypeItem = {
    label: string;
    value: 'income' | 'expense';
  };

  const typeItem: TypeItem[] = [
    { label: '支出', value: 'expense' },
    { label: '收入', value: 'income' },
  ];

  const getList = useCallback(
    async (type: 'income' | 'expense') => {
      const txs = await getStateisticsByCategory(type);
      setCategoryList(txs);

      const data = txs?.map((item, index) => ({
        name: item.label,
        amount: item.amount,
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      }));
      setPieData(data);
    },
    [colors]
  );

  useFocusEffect(
    useCallback(() => {
      getList(type);
    }, [getList, type])
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

      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="16"
      />
      {categoryList?.map((item) => (
        <Pressable key={item.label} style={styles.item} onPress={() => {}}>
          <Ionicons
            name={item.icon as any}
            size={20}
            color={Colors[colorScheme].icon}
          />

          <ThemedText type="defaultSemiBold">{item.label}</ThemedText>

          <View style={{ flex: 1 }} />
          <ThemedText>{toCurrency(item.amount)}</ThemedText>
        </Pressable>
      ))}
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
  cardContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 5,
    minHeight: 60,
  },
});

export default EditTransaction;
