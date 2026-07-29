import { create } from 'zustand';
import { User } from '@/types/user';

export type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (userData) => set({ user: userData, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateUser: (userData) => set((state) => ({ user: state.user ? { ...state.user, ...userData } : null })),
}));
