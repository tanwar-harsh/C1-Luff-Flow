'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserSummary } from '@/types/domain';
import {
  canCreateTicket,
  canManageUsers,
  canMutateTicket,
  canViewTickets,
} from '@/utils/permissions';
import { fetchCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister, RegisterInput } from '@/services/authService';
import { LoginInput } from '@/services/authService';

interface AuthContextValue {
  user: UserSummary | null;
  isLoading: boolean;
  isAdmin: boolean;
  canViewTickets: boolean;
  canCreateTicket: boolean;
  canMutateTicket: boolean;
  canManageUsers: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await fetchCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (input: LoginInput) => {
    const { user: loggedIn } = await apiLogin(input);
    setUser(loggedIn);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { user: registered } = await apiRegister(input);
    setUser(registered);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: role === 'ADMIN',
        canViewTickets: canViewTickets(role),
        canCreateTicket: canCreateTicket(role),
        canMutateTicket: canMutateTicket(role),
        canManageUsers: canManageUsers(role),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
