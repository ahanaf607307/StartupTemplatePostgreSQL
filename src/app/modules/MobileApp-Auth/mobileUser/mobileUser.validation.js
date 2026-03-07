import { z } from "zod";

const registerMobileUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    }),
});

const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
    }),
});

export const MobileUserValidation = {
    registerMobileUserSchema,
    updateProfileSchema,
};
