import { useAppContext } from '@/app/AppProvider';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemedView } from './ThemedView';

export type Option = {
  label: string;
  value: keyof typeof Ionicons.glyphMap | undefined;
};

type Props = {
  data?: Option[];
  icon?: Option;
  setIcon: (icon: Option) => void;
};

export const DropdownItem = ({
  data = [{ label: '', value: 'link' }],
  icon = { label: '', value: 'link' },
  setIcon,
}: Props) => {
  const { theme } = useAppContext();
  const renderItem = (item: {
    label: string;
    value: keyof typeof Ionicons.glyphMap;
  }) => {
    return (
      <ThemedView
        style={[styles.item, { backgroundColor: Colors[theme].cardBackground }]}
      >
        <Ionicons
          style={styles.icon}
          color={Colors[theme].icon}
          name={item.value}
          size={20}
        />
        <ThemedText style={styles.textItem}>{item.label}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <Dropdown
      style={[
        styles.dropdown,
        { backgroundColor: Colors[theme].cardBackground },
      ]}
      placeholderStyle={[
        styles.placeholderStyle,
        { color: Colors[theme].text },
      ]}
      containerStyle={{
        backgroundColor: Colors[theme].cardBackground,
      }}
      selectedTextStyle={[
        styles.selectedTextStyle,
        { color: Colors[theme].text },
      ]}
      inputSearchStyle={[
        styles.inputSearchStyle,
        { color: Colors[theme].text },
      ]}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="選擇類別"
      searchPlaceholder="搜尋..."
      value={icon}
      onChange={(item) => {
        setIcon(item);
      }}
      renderLeftIcon={() => (
        <Ionicons
          style={styles.icon}
          color={Colors[theme].icon}
          name={icon.value}
          size={20}
        />
      )}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: 10,
    height: 45,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
