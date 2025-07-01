import { TextInput, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'cardBackground'
  );

  return (
    <TextInput
      style={[
        {
          backgroundColor: backgroundColor,
          color: Colors[colorScheme].text,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 15,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
