import { MobileOtpService } from "./mobileOtp.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import prisma from "../../../prisma/client.js";

const sendOtp = async (req, res) => {
    try {
        const { email, name } = req.body;
        await MobileOtpService.sendOtp(prisma, email, name);
        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        if (error instanceof DevBuildError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await MobileOtpService.verifyOtp(prisma, email, otp);
        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        if (error instanceof DevBuildError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "Failed to verify OTP" });
    }
};

export const MobileOtpController = { sendOtp, verifyOtp };
