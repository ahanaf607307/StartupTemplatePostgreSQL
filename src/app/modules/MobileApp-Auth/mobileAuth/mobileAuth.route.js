import { Router } from "express";
import { MobileAuthController } from "./mobileAuth.controller.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { Role } from "../../../utils/role.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { MobileAuthValidation } from "./mobileAuth.validation.js";

const router = Router();

router.post("/login", validateRequest(MobileAuthValidation.loginSchema), MobileAuthController.login);
router.post("/refresh-token", validateRequest(MobileAuthValidation.refreshTokenSchema), MobileAuthController.refreshToken);

router.post("/change-password", checkAuthMiddleware(Role.CUSTOMER), validateRequest(MobileAuthValidation.changePasswordSchema), MobileAuthController.changePassword);

router.post("/forgot-password", validateRequest(MobileAuthValidation.forgotPasswordSchema), MobileAuthController.forgotPassword);
router.post("/verify-forgot-password", validateRequest(MobileAuthValidation.verifyForgotPasswordSchema), MobileAuthController.verifyForgotPassword);

router.post("/reset-password", checkAuthMiddleware(Role.CUSTOMER), validateRequest(MobileAuthValidation.resetPasswordSchema), MobileAuthController.resetPassword);

export const MobileAuthRoutes = router;
