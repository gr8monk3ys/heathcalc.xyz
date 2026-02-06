'use client';

import React, { createContext, useContext, useMemo, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthUser {
  email: string;
  name: string;
  createdAt: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

interface AuthContextState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => { success: boolean; message: string };
  signUp: (name: string, email: string, password: string) => { success: boolean; message: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [accounts, setAccounts] = useLocalStorage<Record<string, StoredAccount>>(
    'healthcheck-auth-accounts',
    {}
  );
  const [user, setUser] = useLocalStorage<AuthUser | null>('healthcheck-auth-user', null);

  const signIn = useCallback(
    (email: string, password: string): { success: boolean; message: string } => {
      const normalizedEmail = normalizeEmail(email);
      const account = accounts[normalizedEmail];

      if (!account) {
        return { success: false, message: 'No account found for this email.' };
      }

      if (account.password !== password) {
        return { success: false, message: 'Incorrect password.' };
      }

      setUser({
        email: account.email,
        name: account.name,
        createdAt: account.createdAt,
      });

      return { success: true, message: 'Signed in successfully.' };
    },
    [accounts, setUser]
  );

  const signUp = useCallback(
    (name: string, email: string, password: string): { success: boolean; message: string } => {
      const normalizedEmail = normalizeEmail(email);

      if (accounts[normalizedEmail]) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      const createdAt = new Date().toISOString();
      const account: StoredAccount = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt,
      };

      setAccounts({
        ...accounts,
        [normalizedEmail]: account,
      });

      setUser({
        name: account.name,
        email: account.email,
        createdAt: account.createdAt,
      });

      return { success: true, message: 'Account created.' };
    },
    [accounts, setAccounts, setUser]
  );

  const signOut = useCallback((): void => {
    setUser(null);
  }, [setUser]);

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [user, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
