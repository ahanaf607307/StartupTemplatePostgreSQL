import { z } from "zod";

const sendOtpSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email" }),
        name: z.string().optional(),
    }),
});

const verifyOtpSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email" }),
        otp: z.string().length(6, { message: "OTP must be 6 digits" }),
    }),
});

export const MobileOtpValidation = { sendOtpSchema, verifyOtpSchema };
