import type { AdminUser } from '../../types/admin.types';
import type { AdminProfileUpdateValues } from '../../schemas/auth.schema';
import { apiRequest, resolveMediaUrl } from '../api/httpClient';
import { emitDataChange } from './storage.util';

export const profileService = {
  async getProfile(): Promise<AdminUser> {
    const res = await apiRequest<AdminUser>('/api/admin/profile');
    return {
      ...res.data,
      profilePicture: resolveMediaUrl(res.data.profilePicture),
    };
  },

  async updateProfile(
    username: string,
    values: AdminProfileUpdateValues,
    avatarFile?: File | null
  ): Promise<AdminUser> {
    const formData = new FormData();
    formData.append('firstName', values.firstName.trim());
    formData.append('lastName', values.lastName.trim());
    formData.append('username', username.trim().toLowerCase());
    formData.append('email', values.email.trim().toLowerCase());
    formData.append('mobile', values.mobile.trim());
    if (avatarFile) {
      formData.append('profilePicture', avatarFile);
    }

    const res = await apiRequest<AdminUser>('/api/admin/profile', {
      method: 'PUT',
      body: formData,
    });

    emitDataChange();
    return {
      ...res.data,
      profilePicture: resolveMediaUrl(res.data.profilePicture),
    };
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> {
    await apiRequest<null>('/api/admin/profile/password', {
      method: 'PUT',
      body: {
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
    });
  },
};
