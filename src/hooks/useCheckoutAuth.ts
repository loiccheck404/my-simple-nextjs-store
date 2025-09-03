// hooks/useCheckoutAuth.ts - Custom hook for handling checkout authentication flow

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { GuestCheckoutData } from "@/types/auth";

interface CheckoutAuthState {
  showAuthModal: boolean;
  authMode: "login" | "register" | "guest";
  loading: boolean;
  error: string | null;
  canProceedToPayment: boolean;
  guestData: GuestCheckoutData | null;
}

interface UseCheckoutAuthReturn extends CheckoutAuthState {
  // Modal controls
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  switchAuthMode: (mode: "login" | "register" | "guest") => void;

  // Authentication actions
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  handleGuestCheckout: (guestData: GuestCheckoutData) => Promise<void>;

  // Checkout flow
  proceedToCheckout: () => Promise<boolean>;
  resetCheckoutFlow: () => void;

  // Helper methods
  getCheckoutUser: () => any;
  shouldShowAuthBenefits: () => boolean;
}

export function useCheckoutAuth(): UseCheckoutAuthReturn {
  const {
    user,
    isAuthenticated,
    isGuest,
    login,
    register,
    convertGuestToUser,
    getCheckoutUserData,
    loading: authLoading,
  } = useAuth();

  const { items, canProceedToCheckout } = useCart();

  const [state, setState] = useState<CheckoutAuthState>({
    showAuthModal: false,
    authMode: "guest",
    loading: false,
    error: null,
    canProceedToPayment: false,
    guestData: null,
  });

  // Open authentication modal
  const openAuthModal = useCallback(
    (mode: "login" | "register" | "guest" = "login") => {
      setState((prev) => ({
        ...prev,
        showAuthModal: true,
        authMode: mode,
        error: null,
      }));
    },
    []
  );

  // Close authentication modal
  const closeAuthModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showAuthModal: false,
      error: null,
    }));
  }, []);

  // Switch authentication mode
  const switchAuthMode = useCallback((mode: "login" | "register" | "guest") => {
    setState((prev) => ({
      ...prev,
      authMode: mode,
      error: null,
    }));
  }, []);

  // Handle user login
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await login(email, password);

        setState((prev) => ({
          ...prev,
          loading: false,
          showAuthModal: false,
          canProceedToPayment: true,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [login]
  );

  // Handle user registration
  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await register(email, password, name);

        setState((prev) => ({
          ...prev,
          loading: false,
          showAuthModal: false,
          canProceedToPayment: true,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [register]
  );

  // Handle guest checkout
  const handleGuestCheckout = useCallback(
    async (guestData: GuestCheckoutData) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Validate guest data
        if (!guestData.email || !guestData.shippingAddress) {
          throw new Error("Please provide email and shipping address");
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          guestData,
          canProceedToPayment: true,
          showAuthModal: false,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid checkout data";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  // Main checkout flow entry point
  const proceedToCheckout = useCallback(async (): Promise<boolean> => {
    // First check if cart has items
    if (!canProceedToCheckout) {
      setState((prev) => ({ ...prev, error: "Your cart is empty" }));
      return false;
    }

    // If user is already authenticated, they can proceed
    if (isAuthenticated && user) {
      setState((prev) => ({ ...prev, canProceedToPayment: true }));
      return true;
    }

    // If user is guest and hasn't provided checkout data, show options
    if (isGuest && !state.guestData) {
      // Show modal with options:
      // 1. Continue as guest
      // 2. Login to existing account
      // 3. Create new account
      openAuthModal("guest");
      return false;
    }

    // If guest has provided data, they can proceed
    if (isGuest && state.guestData) {
      setState((prev) => ({ ...prev, canProceedToPayment: true }));
      return true;
    }

    return false;
  }, [
    canProceedToCheckout,
    isAuthenticated,
    user,
    isGuest,
    state.guestData,
    openAuthModal,
  ]);

  // Reset checkout flow
  const resetCheckoutFlow = useCallback(() => {
    setState({
      showAuthModal: false,
      authMode: "guest",
      loading: false,
      error: null,
      canProceedToPayment: false,
      guestData: null,
    });
  }, []);

  // Get current checkout user (authenticated user or guest data)
  const getCheckoutUser = useCallback(() => {
    if (isAuthenticated && user) {
      return user;
    }

    if (isGuest && state.guestData) {
      return state.guestData;
    }

    return null;
  }, [isAuthenticated, user, isGuest, state.guestData]);

  // Check if we should show authentication benefits
  const shouldShowAuthBenefits = useCallback(() => {
    return isGuest && items.length > 0;
  }, [isGuest, items.length]);

  return {
    // State
    showAuthModal: state.showAuthModal,
    authMode: state.authMode,
    loading: state.loading || authLoading,
    error: state.error,
    canProceedToPayment: state.canProceedToPayment,
    guestData: state.guestData,

    // Modal controls
    openAuthModal,
    closeAuthModal,
    switchAuthMode,

    // Authentication actions
    handleLogin,
    handleRegister,
    handleGuestCheckout,

    // Checkout flow
    proceedToCheckout,
    resetCheckoutFlow,

    // Helper methods
    getCheckoutUser,
    shouldShowAuthBenefits,
  };
}
