import bcrypt from "bcrypt";
import DevBuildError from "../../../lib/DevBuildError.js";
import { createMobileTokens } from "./mobileTokenGenerator.js";

export const MobileAuthService = {
    login: async (prisma, email, password) => {
        const mobileUser = await prisma.mobileUser.findUnique({
            where: { email },
        });

        if (!mobileUser) {
            throw new DevBuildError("Invalid email or password", 401);
        }

        if (!mobileUser.isVerified) {
            throw new DevBuildError("Your account is not verified", 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, mobileUser.passwordHash);

        if (!isPasswordMatch) {
            throw new DevBuildError("Invalid email or password", 401);
        }

        const tokens = createMobileTokens(mobileUser);

        return {
            mobileUser: {
                id: mobileUser.id,
                name: mobileUser.name,
                email: mobileUser.email,
                role: mobileUser.role,
            },
            ...tokens,
        };
    },

    changePassword: async (prisma, mobileUserId, oldPassword, newPassword) => {
        const mobileUser = await prisma.mobileUser.findUnique({ where: { id: mobileUserId } });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);

        const isMatch = await bcrypt.compare(oldPassword, mobileUser.passwordHash);
        if (!isMatch) throw new DevBuildError("Old password does not match", 400);

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.mobileUser.update({
            where: { id: mobileUserId },
            data: { passwordHash: hashedNewPassword },
        });
    },

    resetPassword: async (prisma, mobileUserId, newPassword) => {
        const mobileUser = await prisma.mobileUser.findUnique({ where: { id: mobileUserId } });

        if (!mobileUser) throw new DevBuildError("Mobile user not found", 404);
        if (!mobileUser.forgotPasswordStatus) throw new DevBuildError("Unauthorized password reset", 401);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.mobileUser.update({
            where: { id: mobileUserId },
            data: {
                passwordHash: hashedPassword,
                forgotPasswordStatus: false,
            },
        });
    },
};
