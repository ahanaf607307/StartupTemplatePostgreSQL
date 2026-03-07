import crypto from "crypto";
import { sendEmail } from "../../../utils/sendEmail.js";
import { redisClient } from "../../../config/redis.config.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import jwt from "jsonwebtoken";
import { envVars } from "../../../config/env.js";

const OTP_EXPIRATION = 2 * 60; // 2 minutes

const generateOtp = (length = 6) =>
    crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

export const MobileOtpService = {
    sendOtp: async (prisma, email, name) => {
        const mobileUser = await prisma.mobileUser.findUnique({
            where: { email },
            select: { id: true, isVerified: true, name: true },
        });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);
        if (mobileUser.isVerified) throw new DevBuildError("You are already verified", 401);

        const otp = generateOtp();
        const redisKey = `mobile-otp:${email}`;

        await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION });

        await sendEmail({
            to: email,
            subject: "Verification OTP",
            templateName: "otp",
            templateData: { name: name || mobileUser.name, otp },
        });
    },

    verifyOtp: async (prisma, email, otp) => {
        const mobileUser = await prisma.mobileUser.findUnique({
            where: { email },
            select: { id: true, isVerified: true },
        });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);
        if (mobileUser.isVerified) throw new DevBuildError("You are already verified", 401);

        const redisKey = `mobile-otp:${email}`;
        const savedOtp = await redisClient.get(redisKey);

        if (!savedOtp || savedOtp !== otp) {
            throw new DevBuildError("Invalid or expired OTP", 401);
        }

        await prisma.mobileUser.update({
            where: { email },
            data: { isVerified: true },
        });
        await redisClient.del(redisKey);
    },

    sendForgotPasswordOtp: async (prisma, email) => {
        const mobileUser = await prisma.mobileUser.findUnique({ where: { email } });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);
        if (!mobileUser.isVerified) throw new DevBuildError("Mobile user is not verified", 401);

        const otp = generateOtp();
        const redisKey = `mobile-forgot-password:${email}`;

        await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION });

        await sendEmail({
            to: email,
            subject: "Forgot Password OTP",
            templateName: "forgotPassword",
            templateData: { name: mobileUser.name, otp },
        });
    },

    verifyForgotPasswordOtp: async (prisma, email, otp) => {
        const redisKey = `mobile-forgot-password:${email}`;
        const savedOtp = await redisClient.get(redisKey);

        if (!savedOtp || savedOtp !== otp) {
            throw new DevBuildError("Invalid or expired OTP", 401);
        }

        const mobileUser = await prisma.mobileUser.findUnique({
            where: { email },
            select: { id: true, email: true, role: true },
        });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);

        const resetToken = jwt.sign(
            { id: mobileUser.id, email: mobileUser.email, role: mobileUser.role },
            envVars.JWT_SECRET_TOKEN,
            { expiresIn: "10m" }
        );

        await prisma.mobileUser.update({
            where: { email },
            data: { forgotPasswordStatus: true },
        });

        await redisClient.del(redisKey);
        return resetToken;
    },
};
