import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";




import { MobileUserRoutes } from "../modules/MobileApp-Auth/mobileUser/mobileUser.route.js";
import { MobileAuthRoutes } from "../modules/MobileApp-Auth/mobileAuth/mobileAuth.route.js";
import { MobileOtpRoutes } from "../modules/MobileApp-Auth/mobileOtp/mobileOtp.route.js";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
  {
    path: "/mobile/user",
    route: MobileUserRoutes,
  },
  {
    path: "/mobile/auth",
    route: MobileAuthRoutes,
  },
  {
    path: "/mobile/otp",
    route: MobileOtpRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});