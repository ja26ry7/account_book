import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
// import { BSON } from 'realm';
// import { useRealm } from '../realm/RealmProvider';
// import { AccountSummary } from '../realm/types';

const AddTransaction = () => {
  // const realm = useRealm();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [icon, setIcon] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('請輸入有效金額');
      return;
    }

    // realm.write(() => {
    //   const account = realm.objects<AccountSummary>('AccountSummary')[0];

    //   if (!account) {
    //     alert('尚未建立帳戶');
    //     return;
    //   }

    //   const dateKey = date.toISOString().split('T')[0];

    //   let group = account.data.find(
    //     (g: any) => g.date.toISOString().split('T')[0] === dateKey
    //   );

    //   if (!group) {
    //     group = realm.create('TransactionGroup', {
    //       _id: new BSON.ObjectId(),
    //       date,
    //       data: [],
    //     });
    //     account.data.push(group);
    //   }

    //   const item = realm.create('TransactionItem', {
    //     _id: new BSON.ObjectId(),
    //     title: type === 'income' ? '收入' : '支出',
    //     remark,
    //     amount: numericAmount,
    //     icon,
    //     type,
    //   });

    //   group.data.push(item);

    //   if (type === 'income') {
    //     account.income += numericAmount;
    //     account.balance += numericAmount;
    //   } else {
    //     account.expense += numericAmount;
    //     account.balance -= numericAmount;
    //   }
    // });

    // setAmount('');
    // setRemark('');
    // setIcon('');
  };

  return (
    <View style={styles.container}>
      <Text>類型 (income / expense):</Text>
      <TextInput
        value={type}
        onChangeText={(t) => setType(t as any)}
        style={styles.input}
      />

      <Text>金額：</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>備註：</Text>
      <TextInput value={remark} onChangeText={setRemark} style={styles.input} />

      <Text>icon 名稱：</Text>
      <TextInput value={icon} onChangeText={setIcon} style={styles.input} />

      <Text>日期：</Text>
      <Button title={date.toDateString()} onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button title="新增" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
});

export default AddTransaction;
