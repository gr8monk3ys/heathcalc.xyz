'use client';

import React, { useMemo, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { AuthContext, AuthUser } from '@/context/AuthContext';

interface ClerkAuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider that reads user state from Clerk's useUser() hook.
 * This component must be rendered inside <ClerkProvider> and only on the client.
 */
export function ClerkAuthProvider({ children }: ClerkAuthProviderProps): React.JSX.Element {
  const { isSignedIn, user: clerkUser } = useUser();

  const user: AuthUser | null = useMemo(() => {
    if (!isSignedIn || !clerkUser) {
      return null;
    }

    return {
      email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
      name:
        clerkUser.fullName ??
        clerkUser.firstName ??
        clerkUser.primaryEmailAddress?.emailAddress ??
        '',
      createdAt: clerkUser.createdAt
        ? new Date(clerkUser.createdAt).toISOString()
        : new Date().toISOString(),
    };
  }, [isSignedIn, clerkUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(isSignedIn),
    }),
    [user, isSignedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
