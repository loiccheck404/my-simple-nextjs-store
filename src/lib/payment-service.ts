import {
  PaymentRequest,
  PaymentResponse,
  PaymentMethod,
} from "@/types/payment";

export class MockPaymentService {
  private processingDelay = 2000; // 2 seconds to simulate real processing

  // Available payment methods
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
      enabled: true,
    },
    {
      id: "apple_pay",
      type: "apple_pay",
      name: "Apple Pay",
      icon: "/icons/apple-pay.svg",
      enabled: false, // Disable for mock
    },
  ];

  // Test card numbers for different scenarios
  private testCards = {
    success: ["4242424242424242", "5555555555554444"],
    decline: ["4000000000000002"],
    insufficientFunds: ["4000000000009995"],
    expiredCard: ["4000000000000069"],
    cvcFail: ["4000000000000127"],
    networkError: ["4000000000000119"],
  };

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

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay
    await this.delay(this.processingDelay);

    // Validate request
    const validation = this.validateRequest(request);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: "VALIDATION_ERROR",
      };
    }

    // Check test scenarios based on card number
    if (request.cardData) {
      const scenario = this.getCardScenario(request.cardData.cardNumber);
      return this.processCardScenario(scenario, request);
    }

    // Default success for non-card payments
    return this.generateSuccessResponse(request);
  }

  private validateRequest(request: PaymentRequest): {
    valid: boolean;
    error?: string;
  } {
    if (!request.amount || request.amount <= 0) {
      return { valid: false, error: "Invalid amount" };
    }

    if (!request.currency) {
      return { valid: false, error: "Currency is required" };
    }

    if (
      request.paymentMethod.type === "credit_card" ||
      request.paymentMethod.type === "debit_card"
    ) {
      if (!request.cardData) {
        return { valid: false, error: "Card data is required" };
      }

      // Validate card number (basic Luhn algorithm)
      if (!this.isValidCardNumber(request.cardData.cardNumber)) {
        return { valid: false, error: "Invalid card number" };
      }

      // Validate expiry date
      if (!this.isValidExpiryDate(request.cardData.expiryDate)) {
        return { valid: false, error: "Invalid or expired card" };
      }

      // Validate CVV
      if (!this.isValidCVV(request.cardData.cvv)) {
        return { valid: false, error: "Invalid security code" };
      }
    }

    return { valid: true };
  }

  private getCardScenario(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (this.testCards.decline.includes(cleanNumber)) return "decline";
    if (this.testCards.insufficientFunds.includes(cleanNumber))
      return "insufficientFunds";
    if (this.testCards.expiredCard.includes(cleanNumber)) return "expiredCard";
    if (this.testCards.cvcFail.includes(cleanNumber)) return "cvcFail";
    if (this.testCards.networkError.includes(cleanNumber))
      return "networkError";
    if (this.testCards.success.includes(cleanNumber)) return "success";

    // Random scenario for other cards (mostly success)
    const random = Math.random();
    if (random < 0.8) return "success";
    if (random < 0.9) return "decline";
    return "networkError";
  }

  private processCardScenario(
    scenario: string,
    request: PaymentRequest
  ): PaymentResponse {
    switch (scenario) {
      case "decline":
        return {
          success: false,
          error:
            "Your card was declined. Please try a different payment method.",
          errorCode: "CARD_DECLINED",
        };

      case "insufficientFunds":
        return {
          success: false,
          error: "Insufficient funds. Please check your account balance.",
          errorCode: "INSUFFICIENT_FUNDS",
        };

      case "expiredCard":
        return {
          success: false,
          error: "Your card has expired. Please use a different card.",
          errorCode: "EXPIRED_CARD",
        };

      case "cvcFail":
        return {
          success: false,
          error: "Invalid security code. Please check and try again.",
          errorCode: "INVALID_CVC",
        };

      case "networkError":
        return {
          success: false,
          error: "Network error. Please try again.",
          errorCode: "NETWORK_ERROR",
        };

      default:
        return this.generateSuccessResponse(request);
    }
  }

  private generateSuccessResponse(request: PaymentRequest): PaymentResponse {
    const transactionId = `txn_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const orderId = `ord_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    return {
      success: true,
      transactionId,
      orderId,
      processingTime: this.processingDelay,
    };
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, "");

    // Basic length check
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    // Basic Luhn algorithm check
    let sum = 0;
    let isEvenPosition = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEvenPosition) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEvenPosition = !isEvenPosition;
    }

    return sum % 10 === 0;
  }

  private isValidExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(`20${match[2]}`);

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiry = new Date(year, month - 1);

    return expiry > now;
  }

  private isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Get card type from number
  static getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6/.test(cleaned)) return "discover";

    return "unknown";
  }
}

// Singleton instance
export const mockPaymentService = new MockPaymentService();
