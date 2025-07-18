import { TextInput, type TextInputProps } from 'react-native';

import { useAppContext } from '@/app/AppProvider';
import { Colors } from '@/constants/Colors';
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
  const { theme } = useAppContext();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'cardBackground'
  );

  return (
    <TextInput
      style={[
        {
          backgroundColor: backgroundColor,
          color: Colors[theme].text,
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
