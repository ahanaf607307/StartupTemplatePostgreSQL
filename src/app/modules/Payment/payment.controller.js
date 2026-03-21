import { sendResponse } from "../../utils/sendResponse.js";
import { PaymentService } from "./payment.service.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckout = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const result = await PaymentService.createCheckoutSession(userId, amount);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment checkout session created successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Validation error",
        data: error.errors,
      });
    }

    if (error.type === "StripeInvalidRequestError") {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: error.message || "Stripe request error",
      });
    }

    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await PaymentService.getUserPaymentHistory(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment history retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to retrieve payment history",
    });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Missing stripe-signature header",
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: `Webhook Error: ${err.message}`,
    });
  }

  try {
    await PaymentService.handleWebhookEvent(event);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook processed successfully",
      data: { received: true },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    sendResponse(res, {
      success: false,
      statusCode: 500,
      message: "Error processing webhook event",
    });
  }
};

export const PaymentController = {
  createCheckout,
  handleWebhook,
  getPaymentHistory,
}
