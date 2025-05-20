// import { useRealm } from '@/realm/RealmProvider';
import { useRouter } from 'expo-router';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
// import Realm from 'realm';

import { MoneyWave } from '@/components/MoneyWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import { SCHEMA_VERSION, schemas } from '@/realm/schemas';
// import { AccountSummary } from '@/realm/types';
import { useEffect, useState } from 'react';
import { toCurrency } from '../../constants/format';
import dayjs from '../../node_modules/dayjs/esm/index';

export default function HomeScreen() {
  const router = useRouter();
  // const realm = useRealm();
  // const realm = Realm.open({
  //   schema: schemas,
  //   schemaVersion: SCHEMA_VERSION,
  // });
  interface TransactionItem {
    title: string;
    remark: string;
    amount: number;
    icon: string;
    type: string;
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

  const deleteAll = () => {
    console.log('bbb');
    // realm.write(() => {
    //   // 假設只刪除第一筆帳戶
    //   const account = realm.objects<AccountSummary>('AccountSummary')[0];
    //   if (!account) return;
    //   // 先刪掉每一天的交易紀錄與項目
    //   account.data.forEach((group: { data: any }) => {
    //     // 先刪掉當日所有交易項目
    //     realm.delete(group.data);
    //   });
    //   // 再刪掉所有 group
    //   realm.delete(account.data);
    //   // 最後刪除帳戶本身
    //   realm.delete(account);
    // });
  };

  useEffect(() => {
    const getList = () => {
      const summary = {
        balance: 1000,
        income: 2000,
        expense: 1000,
        data: [
          {
            date: '2025-05-12T05:46:10.191Z',
            data: [
              {
                title: '飲食',
                remark: '一幕日',
                amount: 20,
                icon: 'food',
                type: 'expense',
              },
              {
                title: '飲食',
                remark: '直火人',
                amount: 100,
                icon: 'food',
                type: 'expense',
              },
            ],
          },
          {
            date: '2025-05-13T05:46:10.191Z',
            data: [
              {
                title: '飲食',
                remark: '一幕日',
                amount: 30,
                icon: 'food',
                type: 'expense',
              },
              {
                title: '飲食',
                remark: '直火人',
                amount: 100,
                icon: 'food',
                type: 'expense',
              },
            ],
          },
        ],
      };
      setExpense(summary?.expense);
      setIncome(summary?.income);
      setBalance(summary?.balance);
      setDataSource(summary?.data);
    };

    getList();
  }, []);

  // const getList = useCallback(() => {
  //   const summary = realm.objects<AccountSummary>('AccountSummary')[0];
  //   console.log(summary);
  //   setExpense(summary?.expense);
  //   setIncome(summary?.income);
  //   setBalance(summary?.balance);
  //   setDataSource(summary?.data);
  // }, [realm]);

  // useEffect(() => {
  //   const hasAccount =
  //     realm.objects<AccountSummary>('AccountSummary').length > 0;

  //   if (!hasAccount) {
  //     realm.write(() => {
  //       realm.create('AccountSummary', {
  //         _id: new BSON.ObjectId(),
  //         income: 0,
  //         expense: 0,
  //         balance: 0,
  //         data: [],
  //       });
  //     });
  //     console.log('已建立初始帳戶');
  //   } else {
  //     getList();
  //   }
  // }, [getList, realm]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
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
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText type="remark">{item.remark}</ThemedText>
            </View>
            <ThemedText>
              {item.type === 'income' ? '+' : '-'}${toCurrency(item.amount)}
            </ThemedText>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: 'lightgray' }} />
        )}
        renderSectionHeader={({ section: { date } }) => (
          <ThemedText type="subtitle">
            {dayjs(date).format('M月D日 dddd')}
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

      <ThemedView
        style={[styles.add, { bottom: 100 }]}
        lightColor="#A1CEDC"
        darkColor="#1D3D47"
      >
        <Pressable onPress={deleteAll}>
          <ThemedText type="title">-</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.add} lightColor="#A1CEDC" darkColor="#1D3D47">
        <Pressable onPress={add}>
          <ThemedText type="title">+</ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
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
  },

  add: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    position: 'absolute',
    bottom: 20,
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
