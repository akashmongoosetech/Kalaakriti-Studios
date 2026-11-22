import { useEffect } from 'react';
import { useAdminAuthStore } from '../../store/adminAuth.store';

export function useAdminAuth() {
  const user = useAdminAuthStore((s) => s.user);
  const session = useAdminAuthStore((s) => s.session);
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const hydrated = useAdminAuthStore((s) => s.hydrated);
  const hydrate = useAdminAuthStore((s) => s.hydrate);
  const signup = useAdminAuthStore((s) => s.signup);
  const login = useAdminAuthStore((s) => s.login);
  const setUser = useAdminAuthStore((s) => s.setUser);
  const logout = useAdminAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hydrated) {
      void hydrate();
    }
  }, [hydrated, hydrate]);

  return {
    user,
    session,
    isAuthenticated,
    hydrated,
    hydrate,
    signup,
    login,
    setUser,
    logout,
  };
}
