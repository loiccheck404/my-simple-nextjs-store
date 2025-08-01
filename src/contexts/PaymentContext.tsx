"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  PaymentMethod,
} from "@/types/payment";
import { paymentService } from "@/lib/payment-factory";
import { MockPaymentService } from "@/lib/payment-service";

interface PaymentState {
  status: PaymentStatus;
  selectedMethod: PaymentMethod | null;
  processing: boolean;
  error: string | null;
  lastResponse: PaymentResponse | null;
  retryCount: number;
}

type PaymentAction =
  | { type: "SET_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "START_PROCESSING" }
  | { type: "PAYMENT_SUCCESS"; payload: PaymentResponse }
  | {
      type: "PAYMENT_FAILED";
      payload: { error: string; response?: PaymentResponse };
    }
  | { type: "RESET_PAYMENT" }
  | { type: "INCREMENT_RETRY" }
  | { type: "CLEAR_ERROR" };

const initialState: PaymentState = {
  status: "idle",
  selectedMethod: null,
  processing: false,
  error: null,
  lastResponse: null,
  retryCount: 0,
};

function paymentReducer(
  state: PaymentState,
  action: PaymentAction
): PaymentState {
  switch (action.type) {
    case "SET_PAYMENT_METHOD":
      return {
        ...state,
        selectedMethod: action.payload,
        error: null,
      };

    case "START_PROCESSING":
      return {
        ...state,
        status: "processing",
        processing: true,
        error: null,
      };

    case "PAYMENT_SUCCESS":
      return {
        ...state,
        status: "success",
        processing: false,
        error: null,
        lastResponse: action.payload,
        retryCount: 0,
      };

    case "PAYMENT_FAILED":
      return {
        ...state,
        status: "failed",
        processing: false,
        error: action.payload.error,
        lastResponse: action.payload.response || null,
      };

    case "INCREMENT_RETRY":
      return {
        ...state,
        retryCount: state.retryCount + 1,
      };

    case "RESET_PAYMENT":
      return {
        ...initialState,
        selectedMethod: state.selectedMethod, // Keep selected method
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
        status: "idle",
      };

    default:
      return state;
  }
}

interface PaymentContextType extends PaymentState {
  availablePaymentMethods: PaymentMethod[];
  selectPaymentMethod: (method: PaymentMethod) => void;
  processPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  retryPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
  resetPayment: () => void;
  clearError: () => void;
  canRetry: () => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const selectPaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
  }, []);

  const processPayment = useCallback(
    async (request: PaymentRequest): Promise<PaymentResponse> => {
      dispatch({ type: "START_PROCESSING" });

      try {
        const response = await paymentService.processPayment(request);

        if (response.success) {
          // Create order after successful payment
          try {
            const order = await paymentService.createOrder(
              response,
              request.orderData
            );
            response.orderId = order.id;
          } catch (orderError) {
            console.error("Order creation failed:", orderError);
            // Don't fail the payment if order creation fails
          }

          dispatch({ type: "PAYMENT_SUCCESS", payload: response });
        } else {
          dispatch({
            type: "PAYMENT_FAILED",
            payload: {
              error: response.error || "Payment failed",
              response,
            },
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Network error occurred";
        dispatch({
          type: "PAYMENT_FAILED",
          payload: { error: errorMessage },
        });

        return {
          success: false,
          error: errorMessage,
          errorCode: "NETWORK_ERROR",
        };
      }
    },
    []
  );

  const retryPayment = useCallback(
    async (request: PaymentRequest): Promise<PaymentResponse> => {
      dispatch({ type: "INCREMENT_RETRY" });
      return processPayment(request);
    },
    [processPayment]
  );

  const resetPayment = useCallback(() => {
    dispatch({ type: "RESET_PAYMENT" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const canRetry = useCallback(() => {
    return state.retryCount < 3 && state.status === "failed";
  }, [state.retryCount, state.status]);

  const value: PaymentContextType = {
    ...state,
    availablePaymentMethods: MockPaymentService.PAYMENT_METHODS,
    selectPaymentMethod,
    processPayment,
    retryPayment,
    resetPayment,
    clearError,
    canRetry,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
