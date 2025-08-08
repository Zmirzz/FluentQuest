import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem } from '../utils/storage';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'v1_theme_mode';

const palettes = {
  light: {
    mode: 'light',
    bg: '#FAFBFF',
    primaryText: '#2D3A6E',
    text: '#1F2937',
    muted: '#6B778C',
    label: '#334155',
    card: '#FFFFFF',
    border: '#E5E7EB',
    primary: '#4F46E5',
    secondary: '#0EA5E9',
    success: '#22C55E',
  },
  dark: {
    mode: 'dark',
    bg: '#0F172A',
    primaryText: '#E2E8F0',
    text: '#E5E7EB',
    muted: '#94A3B8',
    label: '#CBD5E1',
    card: '#111827',
    border: '#334155',
    primary: '#6366F1',
    secondary: '#22D3EE',
    success: '#22C55E',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = await getItem(STORAGE_KEY);
      if (saved === 'dark') setIsDark(true);
    };
    load();
  }, []);

  const toggle = async () => {
    const next = !isDark;
    setIsDark(next);
    await setItem(STORAGE_KEY, next ? 'dark' : 'light');
  };

  const colors = isDark ? palettes.dark : palettes.light;
  const value = useMemo(() => ({ isDark, colors, toggle }), [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

