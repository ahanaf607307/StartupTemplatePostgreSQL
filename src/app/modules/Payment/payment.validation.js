import { z } from "zod";

const createCheckoutSchema = z.object({
  amount: z.number()
    .positive("Amount must be greater than 0")
    .finite("Amount must be a finite number"),
});

export const PaymentValidation = {
  createCheckoutSchema,
};