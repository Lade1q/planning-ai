import { z } from 'zod';

// 1. Schema for login
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Vui lòng nhập email')
        .refine((val) => z.email().safeParse(val).success, 'Email không đúng định dạng'),
    password: z
        .string()
        .min(8, 'Mật khẩu có tối thiểu 8 ký tự'),
});

// 2. Schema cho Form Đăng ký
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Vui lòng nhập họ và tên'),
        email: z
            .string()
            .min(1, 'Vui lòng nhập email')
            .refine((val) => z.email().safeParse(val).success, 'Email không đúng định dạng'),
        password: z
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
        confirmPassword: z
            .string()
            .min(1, 'Vui lòng nhập lại mật khẩu'),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'], // Hiển thị lỗi trực tiếp tại ô Confirm Password
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;