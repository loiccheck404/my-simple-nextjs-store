import { loadStripe, Stripe } from "@stripe/stripe-js";
import { PaymentRequest, PaymentResponse, PaymentMethod } from "@/types/payment";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export class StripePaymentService {
  private stripe: Stripe | null = null;

  // Add the same PAYMENT_METHODS as MockPaymentService for consistency
  static readonly PAYMENT_METHODS: PaymentMethod[] = [
    {
      id: "credit_card",
      type: "credit_card",
      name: "Credit Card",
      icon: "/icons/credit-card.svg",
      enabled: true,
    },
    {
      id: "debit_card",
      type: "debit_card",
      name: "Debit Card",
      icon: "/icons/debit-card.svg",
      enabled: true,
    },
    {
      id: "paypal",
      type: "paypal",
      name: "PayPal",
      icon: "/icons/paypal.svg",
      enabled: false, // Stripe doesn't handle PayPal directly
    },
    {
      id: "apple_pay",
      type: "apple_pay",
      name: "Apple Pay",
      icon: "/icons/apple-pay.svg",
      enabled: true, // Stripe supports Apple Pay
    },
  ];

  async initialize() {
    this.stripe = await getStripe();
    return this.stripe;
  }

  // Add the main interface method that PaymentContext expects
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Initialize Stripe if not already done
      if (!this.stripe) {
        await this.initialize();
      }

      // Create payment intent on the server
      const paymentIntentResponse = await this.createPaymentIntent(
        request.amount / 100, // Convert from cents back to dollars
        request.currency.toLowerCase()
      );

      if (!paymentIntentResponse.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Confirm payment with Stripe
      const result = await this.confirmPayment(
        paymentIntentResponse.clientSecret,
        {
          card: {
            number: request.cardData?.cardNumber,
            exp_month: request.cardData?.expiryDate.split('/')[0],
            exp_year: `20${request.cardData?.expiryDate.split('/')[1]}`,
            cvc: request.cardData?.cvv,
          },
          billing_details: {
            name: request.cardData?.cardholderName,
            address: {
              line1: request.billingAddress.street,
              line2: request.billingAddress.apartment,
              city: request.billingAddress.city,
              state: request.billingAddress.state,
              postal_code: request.billingAddress.zipCode,
              country: request.billingAddress.country,
            },
          },
        }
      );

      return result;
    } catch (error) {
      console.error("Stripe payment processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed",
        errorCode: "STRIPE_ERROR",
      };
    }
  }

  // Add the createOrder method for interface compatibility
  async createOrder(
    paymentResponse: PaymentResponse,
    orderData: any
  ): Promise<any> {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerData: orderData.customerInfo,
          items: orderData.items,
          total: orderData.items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          ),
          paymentData: {
            paymentMethod: orderData.paymentMethod,
            transactionId: paymentResponse.transactionId,
            paymentProcessor: "stripe",
          },
          shippingData: {
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string = "usd") {
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    return response.json();
  }

  async confirmPayment(
    clientSecret: string,
    paymentMethod: any
  ): Promise<PaymentResponse> {
    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Payment failed",
        errorCode: result.error.code || "PAYMENT_FAILED",
      };
    }

    return {
      success: true,
      transactionId: result.paymentIntent.id,
      processingTime: 2000,
    };
  }
}

export const stripePaymentService = new StripePaymentService();