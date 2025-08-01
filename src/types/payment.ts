export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "apple_pay" | "google_pay";
  name: string;
  icon: string;
  enabled: boolean;
}

export interface CreditCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: Address;
}

export interface Address {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Add this to your payment.ts file
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  cardData?: CreditCardData;
  billingAddress: Address;
  orderData: {
    items: CartItem[];
    shippingAddress: Address;
    customerInfo: {
      email: string;
      name?: string;
      phone?: string;
    };
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  orderId?: string;
  error?: string;
  errorCode?: string;
  processingTime?: number;
}

export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "cancelled";
