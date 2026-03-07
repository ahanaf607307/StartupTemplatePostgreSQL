import express from "express";
import { MobileUserController } from "./mobileUser.controller.js";
import { Role } from "../../../utils/role.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { MobileUserValidation } from "./mobileUser.validation.js";

const upload = createMulterUpload({ folder: "avatars" });
const router = express.Router();

router.post("/register", upload.single("avatar"), validateRequest(MobileUserValidation.registerMobileUserSchema), MobileUserController.registerMobileUser);
router.get("/profile/me", checkAuthMiddleware(Role.CUSTOMER), MobileUserController.getMobileUserInfo);
router.patch("/update-profile", checkAuthMiddleware(Role.CUSTOMER), upload.single("avatar"), validateRequest(MobileUserValidation.updateProfileSchema), MobileUserController.updateProfile);

export const MobileUserRoutes = router;
