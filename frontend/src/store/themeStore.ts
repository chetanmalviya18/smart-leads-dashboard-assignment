import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

const getInitialTheme = (): boolean => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: getInitialTheme(),

  toggleTheme: () => {
    const newDark = !get().isDark;
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDark: newDark });
  },
}));
