import Stripe from 'stripe'
import prisma from '../../prisma/client.js'
import { AppError } from '../../errorHelper/appError.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId, amount) => {
  try {
    // Validate inputs
    if (!userId || !amount) {
      throw new AppError(400, "User ID and amount are required");
    }

    if (amount <= 0) {
      throw new AppError(400, "Amount must be greater than 0");
    }

    // Amount in cents
    const amountInCents = Math.round(amount * 100);

    // 1. Create order
    const order = await prisma.order.create({
      data: {
        userId,
        amount: amountInCents,
        currency: "usd",
        status: "pending",
      },
    });

    // 2. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
              description: "Order payment",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?orderId=${order.id}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: undefined, // Will be set if available
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    });

    // 3. Save session id
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSession: session.id },
    });

    return {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order.id,
      amount: (amountInCents / 100),
    };
  } catch (error) {
    // If order was created but session failed, mark as failed
    if (error.data?.order?.id) {
      await prisma.order.update({
        where: { id: error.data.order.id },
        data: { status: "failed" },
      });
    }
    throw error;
  }
};

const handleWebhookEvent = async (event) => {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("No orderId in webhook metadata");
          return;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "paid",
            stripeSession: session.id,
          },
        });

        console.log(`Order ${orderId} marked as paid`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("No orderId in webhook metadata");
          return;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "failed" },
        });

        console.log(`Order ${orderId} session expired`);
        break;
      }

      case "charge.failed": {
        const charge = event.data.object;
        const orderId = charge.metadata?.orderId;

        if (!orderId) {
          console.error("No orderId in charge metadata");
          return;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "failed" },
        });

        console.log(`Order ${orderId} payment failed`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const orderId = charge.metadata?.orderId;

        if (!orderId) {
          console.error("No orderId in charge metadata");
          return;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "refunded" },
        });

        console.log(`Order ${orderId} refunded`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    throw error;
  }
};

const getUserPaymentHistory = async (userId) => {
  try {
    if (!userId) {
      throw new AppError(400, "User ID is required");
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        amount: true,
        currency: true,
        status: true,
        stripeSession: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Convert amount from cents to dollars for display
    const formattedOrders = orders.map(order => ({
      ...order,
      amount: order.amount / 100,
    }));

    return {
      totalOrders: orders.length,
      orders: formattedOrders,
    };
  } catch (error) {
    console.error("Error fetching user payment history:", error);
    throw new AppError(500, "Failed to fetch payment history");
  }
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhookEvent,
  getUserPaymentHistory,
};