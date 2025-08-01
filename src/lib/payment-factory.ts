import { MockPaymentService } from "./payment-service";
import { StripePaymentService } from "./stripe-service";

export function createPaymentService() {
  const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE || "mock";

  if (paymentMode === "stripe") {
    return new StripePaymentService();
  }

  return new MockPaymentService();
}

export const paymentService = createPaymentService();
