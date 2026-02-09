'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { clerkEnabled } from '@/utils/auth';

export interface AuthUser {
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const UNAUTHENTICATED: AuthContextState = {
  user: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Fallback AuthProvider used when Clerk is not configured or during SSR/SSG.
 */
function FallbackAuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  return <AuthContext.Provider value={UNAUTHENTICATED}>{children}</AuthContext.Provider>;
}

/**
 * Dynamically loaded Clerk auth provider - only loaded client-side
 * to avoid SSG prerendering issues with Clerk's useUser() hook.
 */
const ClerkAuthProviderLazy = clerkEnabled
  ? dynamic(
      () =>
        import('@/context/ClerkAuthProvider').then(mod => ({
          default: mod.ClerkAuthProvider,
        })),
      {
        ssr: false,
        loading: () => null,
      }
    )
  : null;

/**
 * AuthProvider that delegates to Clerk (client-side only) or fallback.
 */
export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  if (ClerkAuthProviderLazy) {
    return <ClerkAuthProviderLazy>{children}</ClerkAuthProviderLazy>;
  }

  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
}

export { AuthContext };

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
