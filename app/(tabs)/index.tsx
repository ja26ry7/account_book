import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useFocusEffect, useRouter } from 'expo-router';
import { Alert, Pressable, SectionList, StyleSheet, View } from 'react-native';

import { MoneyWave } from '@/components/MoneyWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Colors } from '@/constants/Colors';
import { deleteTransaction, getTransactions, initDB } from '@/db/db';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useCallback, useEffect, useState } from 'react';
import { toCurrency } from '../../constants/format';
import dayjs from '../../node_modules/dayjs/esm/index';

export default function HomeScreen() {
  const router = useRouter();
  dayjs.locale('zh-tw');
  dayjs.extend(LocalizedFormat);
  const colorScheme = useColorScheme() ?? 'light';
  interface TransactionItem {
    id: number;
    title: string;
    remark: string;
    amount: number;
    icon: string;
    type: string;
    date: string;
  }

  interface TransactionGroup {
    date: string;
    data: TransactionItem[];
  }

  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [dataSource, setDataSource] = useState<TransactionGroup[]>([]);

  const add = () => {
    router.navigate('/addTransaction');
  };

  const getList = async () => {
    const txs = await getTransactions();
    // console.log(txs);
    setDataSource(txs.data as any);
    setBalance(txs.balance);
    setIncome(txs.income);
    setExpense(txs.expense);
  };

  const deleteItem = async (id: number) => {
    Alert.alert('確認', '確認要刪除？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: () => {
          deleteTransaction(id).then(() => {
            getList();
          });
        },
        style: 'destructive',
      },
    ]);
  };
  interface ListItemProps {
    item: TransactionItem;
    deleteItem: (id: number) => void;
  }

  const ListItem: React.FC<ListItemProps> = ({ item, deleteItem }) => {
    const [showTrash, setShowTrash] = useState(false);

    return (
      <Pressable
        style={styles.item}
        onLongPress={() => setShowTrash(!showTrash)}
        onPress={() => {
          setShowTrash(false);
          router.navigate({
            pathname: '/editTransaction',
            params: {
              originalType: item.type,
              originalAmount: item.amount.toString(),
              originalRemark: item.remark,
              originalTitle: item.title,
              originalIcon: item.icon,
              originalDate: item.date,
              id: item.id,
            },
          });
        }}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={Colors[colorScheme].icon}
        />
        <View style={{ justifyContent: 'center' }}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          {item.remark && <ThemedText type="remark">{item.remark}</ThemedText>}
        </View>
        <View style={{ flex: 1 }} />
        <ThemedText>
          {item.type === 'income' ? '+' : '-'}${toCurrency(item.amount)}
        </ThemedText>
        {showTrash && (
          <Pressable onPress={() => deleteItem(item.id)}>
            <Entypo name="trash" size={24} color="red" />
          </Pressable>
        )}
      </Pressable>
    );
  };

  useEffect(() => {
    (async () => {
      await initDB();
      getList();
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getList();
    }, [])
  );

  // 判斷是否為今年
  const isNotThisYear = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const thisYear = new Date().getFullYear();
    return date.getFullYear() !== thisYear;
  };

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#ffffff" darkColor="#1e1e1e">
      <ThemedView
        style={styles.cardContainer}
        lightColor="#A1CEDC"
        darkColor="#A1CEDC"
      >
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle">淨資產</ThemedText>
          <MoneyWave />
        </View>
        <ThemedText type="title">{toCurrency(balance)}</ThemedText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ThemedText type="subtitle">收入：{toCurrency(income)}</ThemedText>
          <ThemedText type="subtitle">|</ThemedText>
          <ThemedText type="subtitle">支出：{toCurrency(expense)}</ThemedText>
        </View>
      </ThemedView>

      <SectionList
        sections={dataSource}
        keyExtractor={(item, index) => item.title + index}
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 15 }}
        renderItem={({ item }) => (
          <ListItem item={item} deleteItem={deleteItem} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: 'lightgray' }} />
        )}
        renderSectionHeader={({ section: { date } }) => (
          <ThemedText
            type="subtitle"
            lightColor="#5b33ff"
            darkColor="#8a75e1"
            style={{
              paddingVertical: 5,
              backgroundColor: colorScheme === 'light' ? '#ffffff' : '#1e1e1e',
            }}
          >
            {dayjs(date).format(
              isNotThisYear(date) ? 'YYYY年M月D日 dddd' : 'M月D日 dddd'
            )}
          </ThemedText>
        )}
        ListEmptyComponent={() => (
          <ThemedView
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText>無資料</ThemedText>
          </ThemedView>
        )}
      />

      <ThemedView style={styles.add} lightColor="#A1CEDC" darkColor="#1D3D47">
        <Pressable onPress={add}>
          <ThemedText type="title">+</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  add: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    position: 'absolute',
    bottom: 100,
    right: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.28,
    shadowRadius: 7.0,
    elevation: 10,
    zIndex: 99999,
  },
});
