import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { checkIsAdmin } from '../services/auth';
import type { AuthState } from '../types';

export function useAdminAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    userId: null,
    email: null,
  });

  useEffect(() => {
    let mounted = true;

    async function resolveSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        if (mounted) setState({ isAuthenticated: false, isAdmin: false, isLoading: false, userId: null, email: null });
        return;
      }

      const isAdmin = await checkIsAdmin(session.user.id);
      if (mounted) {
        setState({
          isAuthenticated: true,
          isAdmin,
          isLoading: false,
          userId: session.user.id,
          email: session.user.email ?? null,
        });
      }
    }

    resolveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session || !session.user) {
        if (mounted) setState({ isAuthenticated: false, isAdmin: false, isLoading: false, userId: null, email: null });
        return;
      }
      const isAdmin = await checkIsAdmin(session.user.id);
      if (mounted) {
        setState({
          isAuthenticated: true,
          isAdmin,
          isLoading: false,
          userId: session.user.id,
          email: session.user.email ?? null,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
