import { create } from 'zustand';
import type { AdminSession, AdminUser } from '../types/admin.types';
import { adminAuthService } from '../services/admin/auth.service';
import { registerUnauthorizedHandler } from '../services/api/httpClient';
import type { AdminSignupValues } from '../schemas/auth.schema';

interface AdminAuthState {
  user: AdminUser | null;
  session: AdminSession | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  hydrating: boolean;
  hydrate: () => Promise<void>;
  signup: (values: AdminSignupValues, avatarFile?: File | null) => Promise<AdminUser>;
  login: (params: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<AdminUser>;
  setUser: (user: AdminUser) => void;
  logout: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  hydrated: false,
  hydrating: false,

  hydrate: async () => {
    if (get().hydrated || get().hydrating) return;
    set({ hydrating: true });
    try {
      const restored = await adminAuthService.restoreSession();
      set({
        user: restored?.user ?? null,
        session: restored?.session ?? null,
        isAuthenticated: Boolean(restored?.user),
        hydrated: true,
        hydrating: false,
      });
    } catch {
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        hydrated: true,
        hydrating: false,
      });
    }
  },

  signup: async (values, avatarFile) => {
    const { user, session } = await adminAuthService.signup(values, avatarFile);
    set({
      user,
      session,
      isAuthenticated: true,
      hydrated: true,
    });
    return user;
  },

  login: async (params) => {
    const { user, session } = await adminAuthService.login(params);
    set({
      user,
      session,
      isAuthenticated: true,
      hydrated: true,
    });
    return user;
  },

  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
    }));
  },

  logout: async () => {
    await adminAuthService.logout();
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      hydrated: true,
    });
  },
}));

registerUnauthorizedHandler(() => {
  useAdminAuthStore.setState({
    user: null,
    session: null,
    isAuthenticated: false,
    hydrated: true,
  });
});
