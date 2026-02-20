'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getSupabaseBrowserClient, isSupabaseEnabled } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  supabaseEnabled: boolean;
  signIn: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

function mapSupabaseUser(su: SupabaseUser): AuthUser {
  return {
    id: su.id,
    email: su.email ?? '',
    name: su.user_metadata?.name ?? su.email ?? '',
    createdAt: su.created_at,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider that integrates with Supabase Auth when env vars are set,
 * and falls back to an unauthenticated stub when they are not.
 */
export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const enabled = isSupabaseEnabled();
  const [authState, setAuthState] = useState<{
    user: AuthUser | null;
    isLoading: boolean;
  }>({
    user: null,
    isLoading: enabled,
  });
  const { user, isLoading } = authState;

  useEffect(() => {
    if (!enabled) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Get the initial session.
    supabase.auth.getUser().then(({ data }) => {
      setAuthState({
        user: data.user ? mapSupabaseUser(data.user) : null,
        isLoading: false,
      });
    });

    // Listen for auth state changes (sign in, sign out, token refresh).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ? mapSupabaseUser(session.user) : null,
        isLoading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [enabled]);

  const signIn = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      if (!enabled) {
        return { error: 'Authentication is not configured.' };
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { error: 'Authentication is not configured.' };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // After clicking the magic link, redirect back to the site.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    },
    [enabled]
  );

  const signOut = useCallback(async (): Promise<void> => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthState(prevState => ({ ...prevState, user: null }));
  }, []);

  const value: AuthContextState = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    supabaseEnabled: enabled,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
