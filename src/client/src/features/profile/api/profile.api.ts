import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { ApiEnvelope } from '@/types/api.types';
import type { User } from '@/features/auth/api/auth.api';
import type { UpdateNameInput, ChangePasswordInput } from '../types/profile.types';

export const profileApi = {
  updateName: async (input: UpdateNameInput): Promise<User> => {
    const response = await apiClient.patch<ApiEnvelope<User>>(ENDPOINTS.USERS.PROFILE, input);
    return response.data.data;
  },

  changePassword: async (input: ChangePasswordInput): Promise<{ message: string }> => {
    const response = await apiClient.patch<ApiEnvelope<{ message: string }>>(
      ENDPOINTS.USERS.PASSWORD,
      input
    );
    return response.data.data;
  },
};
