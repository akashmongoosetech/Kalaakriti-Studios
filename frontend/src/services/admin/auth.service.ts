import type { AdminSession, AdminUser } from '../../types/admin.types';
import type { AdminSignupValues } from '../../schemas/auth.schema';
import { apiRequest, resolveMediaUrl, setAccessToken } from '../api/httpClient';

interface AuthApiPayload {
  user: AdminUser;
  token: string;
}

function normalizeUser(user: AdminUser): AdminUser {
  return {
    ...user,
    profilePicture: resolveMediaUrl(user.profilePicture),
  };
}

function buildSession(user: AdminUser, rememberMe = true): AdminSession {
  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    rememberMe,
    loggedInAt: new Date().toISOString(),
  };
}

export const adminAuthService = {
  async signup(
    values: AdminSignupValues,
    avatarFile?: File | null
  ): Promise<{ user: AdminUser; session: AdminSession }> {
    const formData = new FormData();
    formData.append('firstName', values.firstName.trim());
    formData.append('lastName', values.lastName.trim());
    formData.append('email', values.email.trim().toLowerCase());
    formData.append('mobile', values.mobile.trim());
    formData.append('password', values.password);
    if (avatarFile) {
      formData.append('profilePicture', avatarFile);
    }

    const res = await apiRequest<AuthApiPayload>('/api/admin/auth/signup', {
      method: 'POST',
      body: formData,
      suppressUnauthorizedEvent: true,
    });

    const user = normalizeUser(res.data.user);
    setAccessToken(res.data.token);
    return {
      user,
      session: buildSession(user, true),
    };
  },

  async login(params: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }): Promise<{ user: AdminUser; session: AdminSession }> {
    const res = await apiRequest<AuthApiPayload>('/api/admin/auth/login', {
      method: 'POST',
      body: {
        identifier: params.identifier.trim(),
        password: params.password,
        rememberMe: Boolean(params.rememberMe),
      },
      suppressUnauthorizedEvent: true,
    });

    const user = normalizeUser(res.data.user);
    setAccessToken(res.data.token);
    return {
      user,
      session: buildSession(user, params.rememberMe),
    };
  },

  async restoreSession(): Promise<{ user: AdminUser; session: AdminSession } | null> {
    try {
      const res = await apiRequest<AuthApiPayload>('/api/admin/auth/me', {
        suppressUnauthorizedEvent: true,
      });
      if (!res.data?.user) {
        return null;
      }
      const user = normalizeUser(res.data.user);
      if (res.data.token) {
        setAccessToken(res.data.token);
      }
      return {
        user,
        session: buildSession(user, true),
      };
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  async logout(): Promise<void> {
    setAccessToken(null);
    try {
      await apiRequest('/api/admin/auth/logout', {
        method: 'POST',
        suppressUnauthorizedEvent: true,
      });
    } catch {
      // Ignore network errors during logout
    }
  },

  async requestPasswordRecovery(identifier: string): Promise<string> {
    const res = await apiRequest<{ identifier: string; deliveryConfigured: boolean }>(
      '/api/admin/auth/forgot-password',
      {
        method: 'POST',
        body: { identifier: identifier.trim() },
        suppressUnauthorizedEvent: true,
      }
    );
    return res.message;
  },
};
