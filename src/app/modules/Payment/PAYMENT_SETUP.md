# Payment Module Setup Guide

## Overview
This payment module provides Stripe integration for handling payments and webhooks in your application.

## Features
- ✅ Create checkout sessions
- ✅ Handle Stripe webhooks (payment completed, expired, failed, refunded)
- ✅ Order management (pending, paid, failed, refunded, cancelled)
- ✅ Error handling and validation
- ✅ Proper Stripe webhook signature verification

## Environment Variables Required

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
CLIENT_URL=http://localhost:3000
```

## Installation

The Stripe package is already installed. If not, run:
```bash
npm install stripe
```

## API Endpoints

### 1. Create Checkout Session
**POST** `/api/payments/checkout`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (must be authenticated)

**Request Body:**
```json
{
  "amount": 99.99
}
```

**Response (Success):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment checkout session created successfully",
  "data": {
    "success": true,
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_...",
    "sessionId": "cs_test_...",
    "orderId": "uuid-...",
    "amount": 99.99
  }
}
```

### 2. Webhook Endpoint
**POST** `/api/payments/webhook`

**Headers:**
- `stripe-signature: {signature}` (automatically added by Stripe)

This endpoint handles the following events:
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Session expired
- `charge.failed` - Payment failed
- `charge.refunded` - Payment refunded

## Webhook Setup in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL: `{YOUR_BACKEND_URL}/api/payments/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.failed`
   - `charge.refunded`
6. Copy the **Signing secret** and add to `.env` as `STRIPE_WEBHOOK_SECRET`

## Database Schema

### Order Model
```prisma
model Order {
  id            String      @id @default(uuid())
  userId        String
  amount        Int         // Amount in cents
  currency      String      @default("usd")
  status        OrderStatus @default(pending)
  stripeSession String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  pending
  paid
  failed
  refunded
  cancelled
}
```

### User Model Update
The User model now includes:
```prisma
orders Order[]  // Relation to orders
```

## Testing the Payment Flow

### 1. Create a Checkout Session
```bash
curl -X POST http://localhost:5000/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{"amount": 100}'
```

### 2. Redirect to Checkout
Open the `checkoutUrl` in a browser to complete payment.

### 3. Use Test Card Numbers
For testing in Stripe test mode:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future expiration date and any CVC.

### 4. Test Webhooks Locally
Use Stripe CLI to forward webhook events:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Then trigger test events:
```bash
stripe trigger test_payment_succeeded
```

## Error Handling

The module includes comprehensive error handling for:
- Missing required fields
- Invalid amounts (must be positive)
- Stripe API errors
- Invalid webhook signatures
- Database errors

All errors follow the standard response format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

## Order Status Transitions

```
pending → paid ✅ (on checkout.session.completed)
pending → failed ❌ (on checkout.session.expired or charge.failed)
paid → refunded 🔄 (on charge.refunded)
```

## Important Notes

1. **Amount Format**: The API accepts amounts in dollars (e.g., 99.99), but Stripe stores them in cents
2. **Webhook Verification**: All webhook requests are verified using Stripe's signature
3. **Idempotency**: Webhook handlers are safe to retry
4. **Authentication**: Checkout endpoint requires user authentication
5. **CORS**: Ensure webhook endpoint is accessible without CORS restrictions

## Troubleshooting

### "Missing stripe-signature header"
- Ensure Stripe is sending the request to your webhook URL
- Check webhook configuration in Stripe Dashboard

### "Webhook signature verification failed"
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check that you're using the endpoint-specific signing secret
- Test using Stripe CLI: `stripe listen`

### Order not updating after payment
- Check that webhook endpoint is receiving requests (use Stripe Dashboard logs)
- Verify database connection
- Check application logs for errors

### Checkout URL is null
- Verify `CLIENT_URL` environment variable is set correctly
- Check that order was created in database
- Verify Stripe API key is valid

## Security Considerations

1. ✅ Always verify webhook signatures
2. ✅ Never expose API keys in client-side code
3. ✅ Use environment variables for sensitive data
4. ✅ Validate all input before processing
5. ✅ Use HTTPS for production
6. ✅ Implement rate limiting on payment endpoints
7. ✅ Log all payment transactions for audit trails

## File Structure

```
Payment/
├── payment.controller.js     # Request handlers
├── payment.service.js        # Business logic
├── payment.route.js          # Route definitions
├── payment.validation.js     # Request validation
└── PAYMENT_SETUP.md         # This file
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production Stripe API keys
- [ ] Configure production webhook endpoints
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Implement rate limiting
- [ ] Set up database backups
- [ ] Test webhook delivery in production
- [ ] Monitor payment failures
- [ ] Implement retry logic for failed payments

## Support

For Stripe documentation, visit: https://stripe.com/docs
