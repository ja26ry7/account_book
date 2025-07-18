import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { formatCurrency, toCurrency } from '@/constants/format';
import { getStateisticsByCategory } from '@/db/db';
import { CategoryStat } from '@/db/type';
import Ionicons from '@expo/vector-icons/Ionicons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useAppContext } from '../AppProvider';

const EditTransaction = () => {
  const { theme } = useAppContext();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryList, setCategoryList] = useState<CategoryStat[]>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  type PieDataItem = {
    value: number;
    text: string;
    color: string;
  };
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const colors = React.useMemo(
    () => ['#9F35FF', '#FFCE56', '#FF60AF', '#2894FF', '#00CACA', '#FF9224'],
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
        text: item.label,
        value: item.amount,
        color: colors[index % colors.length],
      }));
      setPieData(data);
    },
    [colors]
  );

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  useFocusEffect(
    useCallback(() => {
      getList(type);
    }, [getList, type])
  );
  return (
    <ScrollView>
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
        <View style={{ alignItems: 'center' }}>
          <PieChart
            data={pieData}
            donut
            radius={120}
            innerRadius={70}
            innerCircleColor={Colors[theme].background}
            focusOnPress
            onPress={(item: PieDataItem, index: number) =>
              setSelectedIndex(index)
            }
            centerLabelComponent={() => {
              const item = pieData[selectedIndex ?? -1];
              if (!item) return null;
              const percent = ((item.value / total) * 100).toFixed(1) + '%';
              return (
                <ThemedView style={{ alignItems: 'center' }}>
                  <ThemedText style={{ fontWeight: 'bold' }}>
                    {item.text}
                  </ThemedText>
                  <ThemedText type="remark">
                    {formatCurrency(item.value)}
                  </ThemedText>
                  <ThemedText type="remark">{percent}</ThemedText>
                </ThemedView>
              );
            }}
          />
        </View>
        {categoryList?.map((item) => (
          <Pressable key={item.label} style={styles.item} onPress={() => {}}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={Colors[theme].icon}
            />
            <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
            <View style={{ flex: 1 }} />
            <ThemedText>{toCurrency(item.amount)}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    </ScrollView>
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
