import express from 'express'
const router = express.Router();
import { PaymentController } from './payment.controller.js';
import { checkAuthMiddleware } from '../../middleware/checkAuthMiddleware.js';
import { Role } from '../../utils/role.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook route - must be before body parser middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleWebhook
);

// Checkout route - requires authentication
router.post(
  "/checkout",
  checkAuthMiddleware(...Object.values(Role)),
  PaymentController.createCheckout
);

// Get payment history - requires authentication
router.get(
  "/history",
  checkAuthMiddleware(...Object.values(Role)),
  PaymentController.getPaymentHistory
);

export const PaymentRouter = router;