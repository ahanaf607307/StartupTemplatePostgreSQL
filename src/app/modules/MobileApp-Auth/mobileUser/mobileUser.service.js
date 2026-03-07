import { envVars } from "../../../config/env.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import bcrypt from "bcrypt";
import { Role } from "../../../utils/role.js";

export const MobileUserService = {
    findByEmail: async (prisma, email) =>
        prisma.mobileUser.findUnique({ where: { email } }),

    findById: async (prisma, id) =>
        prisma.mobileUser.findUnique({ where: { id } }),

    findUserInfoById: async (prisma, id) =>
        prisma.mobileUser.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        }),

    update: async (prisma, id, data) =>
        prisma.mobileUser.update({
            where: { id },
            data,
        }),

    delete: async (prisma, id) =>
        prisma.mobileUser.delete({
            where: { id },
        }),

    updateAvatar: async (prisma, id, avatarUrl, avatarUrlPath) =>
        prisma.mobileUser.update({
            where: { id },
            data: { avatarUrl, avatarUrlPath },
        }),
};

export const createMobileUserService = async (payload) => {
    const { prisma, email, password, picture, ...rest } = payload;

    if (!email || !password) {
        throw new DevBuildError("Email and password are required", 400);
    }

    const existingMobileUser = await prisma.mobileUser.findUnique({
        where: { email },
    });

    if (existingMobileUser) {
        throw new DevBuildError("Mobile user already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(envVars.BCRYPT_SALT_ROUND || 10)
    );

    const mobileUser = await prisma.mobileUser.create({
        data: {
            email,
            passwordHash: hashedPassword,
            avatarUrl: picture?.url,
            avatarUrlPath: picture?.path,
            isVerified: false,
            role: Role.CUSTOMER,
            oauthProvider: "email",
            ...rest,
        },
    });

    return mobileUser;
};
