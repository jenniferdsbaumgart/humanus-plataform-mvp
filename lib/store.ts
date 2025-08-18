import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  score: {
    total: number;
    level: number;
    progress: number;
    nextLevelAt: number;
  };
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  setUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  sidebarCollapsed: false,
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));