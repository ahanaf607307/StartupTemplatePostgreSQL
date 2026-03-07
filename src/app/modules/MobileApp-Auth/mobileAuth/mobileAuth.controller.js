import { MobileAuthService } from "./mobileAuth.service.js";
import { MobileOtpService } from "../mobileOtp/mobileOtp.service.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma/client.js";
import { createNewMobileAccessTokenUsingRefreshToken } from "./mobileTokenGenerator.js";

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await MobileAuthService.login(prisma, email, password);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Mobile user logged in successfully",
            data: result, // Tokens are in result for mobile app
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const accessToken = await createNewMobileAccessTokenUsingRefreshToken(prisma, refreshToken);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Access token refreshed successfully",
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const mobileUserId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        await MobileAuthService.changePassword(prisma, mobileUserId, oldPassword, newPassword);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Password changed successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await MobileOtpService.sendForgotPasswordOtp(prisma, email);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Forgot password OTP sent successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

const verifyForgotPassword = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const resetToken = await MobileOtpService.verifyForgotPasswordOtp(prisma, email, otp);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "OTP verified. Use resetToken to change password.",
            data: { resetToken },
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const mobileUserId = req.user.id;
        const { newPassword } = req.body;
        await MobileAuthService.resetPassword(prisma, mobileUserId, newPassword);
        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Password reset successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const MobileAuthController = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    verifyForgotPassword,
    resetPassword,
};
