import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { getChartData } from '@/db/db';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useAppContext } from '../AppProvider';

import { ThemedText } from '@/components/ThemedText';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const Trend = () => {
  const { theme } = useAppContext();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [groupBy, setGroupBy] = useState<RangeItem['value']>('day');
  const count = 6;

  type ChartDataItem = {
    value: number;
    label: string;
  };
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  type TypeItem = {
    label: string;
    value: 'income' | 'expense';
  };

  type RangeItem = {
    label: string;
    value: 'day' | 'week' | 'month' | 'year';
  };

  const typeItem: TypeItem[] = [
    { label: '支出', value: 'expense' },
    { label: '收入', value: 'income' },
  ];

  const rangeItem: RangeItem[] = [
    { label: '日', value: 'day' },
    { label: '週', value: 'week' },
    { label: '月', value: 'month' },
    { label: '年', value: 'year' },
  ];

  type RawChartItem = { period: string; total: number }; // 原始資料格式
  type DisplayChartItem = { label: string; value: number }; // 用於圖表顯示

  // 5 天
  const fillLast5Days = useCallback((raw: RawChartItem[]) => {
    return [...Array(count)].map((_, i) => {
      const date = dayjs()
        .subtract(count - 1 - i, 'day')
        .format('MM/DD');
      const found = raw.find((item) => item.period === date);
      return {
        label: date,
        value: found?.total ?? 0,
      };
    });
  }, []);

  // 5 週（週起始用 ISO-8601 規則）
  const fillLast5Weeks = useCallback((raw: RawChartItem[]) => {
    dayjs.extend(isoWeek);
    return [...Array(count)].map((_, i) => {
      const weekStart = dayjs()
        .subtract(count - 1 - i, 'week')
        .startOf('isoWeek');

      const label = `W${weekStart.isoWeek().toString().padStart(2, '0')}`;
      const found = raw.find((item) => item.period === label);
      return {
        label: label,
        value: found?.total ?? 0,
      };
    });
  }, []);

  // 5 月
  const fillLast5Months = useCallback((raw: RawChartItem[]) => {
    return [...Array(count)].map((_, i) => {
      const date = dayjs()
        .subtract(count - 1 - i, 'month')
        .format('MM');
      const found = raw.find((item) => item.period === date);
      return {
        label: date,
        value: found?.total ?? 0,
      };
    });
  }, []);

  // 5 年
  const fillLast5Years = useCallback((raw: RawChartItem[]) => {
    return [...Array(count)].map((_, i) => {
      const year = dayjs()
        .subtract(count - 1 - i, 'year')
        .format('YYYY');
      const found = raw.find((item) => item.period === year);
      return {
        label: year,
        value: found?.total ?? 0,
      };
    });
  }, []);

  const getList = useCallback(
    async ({
      type,
      groupBy,
    }: {
      type: TypeItem['value'];
      groupBy: RangeItem['value'];
    }) => {
      const txs = await getChartData({ type, groupBy, count });

      let data: DisplayChartItem[] = [];

      switch (groupBy) {
        case 'day':
          data = fillLast5Days(txs);
          break;
        case 'week':
          data = fillLast5Weeks(txs);
          break;
        case 'month':
          data = fillLast5Months(txs);
          break;
        case 'year':
          data = fillLast5Years(txs);
          break;
      }
      setChartData(data);
    },
    [fillLast5Days, fillLast5Weeks, fillLast5Months, fillLast5Years]
  );

  useFocusEffect(
    useCallback(() => {
      getList({
        type,
        groupBy,
      });
    }, [getList, type, groupBy])
  );

  const format = (val: string | number): string => {
    const num = Number(val);
    if (isNaN(num)) return String(val); // 防止非數字輸入

    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed()}k`;
    return String(num);
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <SegmentedControl
          values={rangeItem.map((e) => e.label)}
          selectedIndex={rangeItem.map((e) => e.value).indexOf(groupBy)}
          onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
            setGroupBy(rangeItem[selectedSegmentIndex].value);
          }}
          style={styles.segment}
          backgroundColor={Colors[theme].background}
          tintColor={Colors[theme].activeTab}
          fontStyle={{ color: Colors[theme].text }}
          activeFontStyle={{ color: Colors[theme].tint }}
        />
        <SegmentedControl
          values={typeItem.map((e) => e.label)}
          selectedIndex={typeItem.map((e) => e.value).indexOf(type)}
          onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
            setType(typeItem[selectedSegmentIndex].value);
          }}
          style={styles.segment}
          backgroundColor={Colors[theme].background}
          tintColor={Colors[theme].activeTab}
          fontStyle={{ color: Colors[theme].text }}
          activeFontStyle={{ color: Colors[theme].tint }}
        />
        <View style={styles.chart}>
          {chartData.length > 1 ? (
            <LineChart
              data={chartData}
              thickness={2}
              color="#007bff"
              xAxisColor={Colors[theme].text}
              yAxisColor={Colors[theme].text}
              isAnimated
              hideDataPoints={false}
              dataPointsColor="#007bff"
              xAxisLabelTextStyle={{ color: '#666' }}
              yAxisTextStyle={{ color: '#666' }}
              noOfSections={4}
              areaChart
              startFillColor="#007bff"
              endFillColor="#007bff"
              startOpacity={0.4}
              endOpacity={0}
              formatYLabel={(label) => format(label)}
            />
          ) : (
            <ThemedText>載入中...</ThemedText>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  segment: {
    marginTop: 20,
    borderRadius: 5,
  },
  chart: {
    paddingTop: 48,
    marginHorizontal: -10,
    flex: 1,
  },
});

export default Trend;
