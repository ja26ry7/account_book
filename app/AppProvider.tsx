import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from '../hooks/useColorScheme.web';

/////////////////////////////////////////////////////

axios.defaults.headers.common['Content-Type'] = 'application/json';

type Theme = 'light' | 'dark';
interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
interface AppProviderProps {
  children: React.ReactNode;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppProvider: React.FC<AppProviderProps> = ({
  theme,
  setTheme,
  children,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(
          savedTheme === 'auto' ? colorScheme : (savedTheme as 'light' | 'dark')
        );
      }
    };
    loadTheme();
  }, [colorScheme, setTheme]);

  /////////////////////////////////////////////////////
  return (
    <AppContext.Provider value={{ theme, setTheme, editMode, setEditMode }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
