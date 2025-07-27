// types/auth.ts - Authentication and user related types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GuestCheckoutData {
  email: string;
  shippingAddress: ShippingAddress;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  apartment?: string;
}

export interface CheckoutFormData {
  // Contact information
  email: string;
  phoneNumber?: string;

  // Shipping address
  shippingAddress: ShippingAddress;

  // Billing address (optional, defaults to shipping)
  billingAddress?: ShippingAddress;
  billingSameAsShipping?: boolean;

  // Payment information (handled by payment processor)
  paymentMethod?: "card" | "paypal" | "bank_transfer";

  // Additional options
  newsletter?: boolean;
  createAccount?: boolean;

  // Account creation data (if createAccount is true)
  accountData?: {
    password: string;
    confirmPassword: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  guestSessionId: string | null;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register" | "checkout";
  onSuccess?: () => void;
  allowGuestCheckout?: boolean;
}

export interface AuthFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onSwitchMode?: () => void;
}

// Guest session management
export interface GuestSession {
  id: string;
  createdAt: string;
  lastActivity: string;
  cartItems?: any[];
}

// Auth event types for cross-component communication
export type AuthEvent =
  | { type: "LOGIN_SUCCESS"; user: User }
  | { type: "LOGOUT" }
  | { type: "GUEST_CHECKOUT_START" }
  | { type: "ACCOUNT_CREATED"; user: User }
  | { type: "AUTH_ERROR"; error: string };

// Checkout authentication options
export interface CheckoutAuthOptions {
  continueAsGuest: boolean;
  requireAccountCreation: boolean;
  allowQuickRegister: boolean;
  showBenefits: boolean;
}

// Order related types that involve auth
export interface OrderCustomer {
  id?: string; // null for guest orders
  email: string;
  name: string;
  phone?: string;
  isGuest: boolean;
}

export interface GuestOrderTracking {
  email: string;
  orderNumber: string;
  accessCode?: string;
}
