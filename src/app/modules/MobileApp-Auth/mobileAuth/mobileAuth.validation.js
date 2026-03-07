import { z } from "zod";

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(6),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

const verifyForgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
        otp: z.string().length(6),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        newPassword: z.string().min(6),
    }),
});

export const MobileAuthValidation = {
    loginSchema,
    refreshTokenSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    verifyForgotPasswordSchema,
    resetPasswordSchema,
};
