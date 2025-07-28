/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const iconColorLight = '#687076';
const iconColorDark = '#9BA1A6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ececec',
    cardBackground: '#ffffff',
    tint: tintColorLight,
    icon: iconColorLight,
    tabIconDefault: iconColorLight,
    tabIconSelected: tintColorLight,
    activeTab: '#ffffff',
    button: '#7fc2d5',
    line: '#D0D0D0',
    delete: '#FF3B30'
  },
  dark: {
    text: '#ECEDEE',
    background: '#1e1e1e',
    cardBackground: '#323232',
    tint: tintColorDark,
    icon: iconColorDark,
    tabIconDefault: iconColorDark,
    tabIconSelected: tintColorDark,
    activeTab: '#687076',
    button: '#27525f',
    line: '#6C6C6C',
    delete: '#bb3a33'
  },
};
