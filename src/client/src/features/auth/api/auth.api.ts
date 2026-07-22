import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';
import type { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export interface User {
    id: string;
    email: string;
    name: string | null;
}

export interface AuthResponse {
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}

// 1. Call Login API
export const loginApi = async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
}

// 2. Call SignUp API
export const registerApi = async (data: RegisterFormData): Promise<AuthResponse> => {
    // Loại bỏ confirmPassword khỏi payload trước khi gửi lên server
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
};