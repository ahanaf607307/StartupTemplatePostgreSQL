import { Router } from "express";
import { MobileOtpController } from "./mobileOtp.controller.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { MobileOtpValidation } from "./mobileOtp.validation.js";

const router = Router();
router.post("/send", validateRequest(MobileOtpValidation.sendOtpSchema), MobileOtpController.sendOtp);
router.post("/verify", validateRequest(MobileOtpValidation.verifyOtpSchema), MobileOtpController.verifyOtp);

export const MobileOtpRoutes = router;
