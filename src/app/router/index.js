import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { PaymentRouter } from "../modules/Payment/payment.route.js";






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
    path: "/user/payment",
    route: PaymentRouter,
  },

];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});