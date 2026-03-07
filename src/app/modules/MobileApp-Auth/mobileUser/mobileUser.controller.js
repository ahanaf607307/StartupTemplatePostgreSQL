import { createMobileUserService, MobileUserService } from "./mobileUser.service.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utils/sendResponse.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import prisma from "../../../prisma/client.js";

const registerMobileUser = async (req, res, next) => {
    try {
        const picture = req.file ? {
            url: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`,
            path: `uploads/avatars/${req.file.filename}`
        } : null;

        const payload = {
            prisma,
            ...req.body,
            picture,
        };

        const result = await createMobileUserService(payload);

        sendResponse(res, {
            success: true,
            message: "Mobile user created successfully",
            statusCode: StatusCodes.CREATED,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMobileUserInfo = async (req, res, next) => {
    try {
        const mobileUserId = req.user.id;
        const mobileUser = await MobileUserService.findUserInfoById(prisma, mobileUserId);

        if (!mobileUser) {
            throw new DevBuildError("Mobile user not found", 404);
        }

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Mobile user info retrieved successfully",
            data: mobileUser,
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const mobileUserId = req.user.id;
        const { name, email } = req.body;

        const allowedUpdates = {};
        if (name) allowedUpdates.name = name;
        if (email) allowedUpdates.email = email;

        if (req.file) {
            const avatarUrlPath = `uploads/avatars/${req.file.filename}`;
            const avatarUrl = `${req.protocol}://${req.get('host')}/${avatarUrlPath}`;
            allowedUpdates.avatarUrl = avatarUrl;
            allowedUpdates.avatarUrlPath = avatarUrlPath;
        }

        const updatedMobileUser = await prisma.mobileUser.update({
            where: { id: mobileUserId },
            data: allowedUpdates,
        });

        sendResponse(res, {
            success: true,
            message: "Profile updated successfully",
            statusCode: StatusCodes.OK,
            data: updatedMobileUser,
        });
    } catch (error) {
        next(error);
    }
};

export const MobileUserController = { registerMobileUser, getMobileUserInfo, updateProfile };
