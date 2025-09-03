"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { api, User } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  guestSessionId: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_GUEST_SESSION"; payload: string }
  | { type: "CONVERT_GUEST_TO_USER"; payload: User }
  | { type: "INITIALIZE_GUEST" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: true,
  loading: true,
  error: null,
  guestSessionId: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isGuest: true,
        error: null,
      };

    case "SET_GUEST_SESSION":
      return {
        ...state,
        guestSessionId: action.payload,
        isGuest: true,
        loading: false,
      };

    case "CONVERT_GUEST_TO_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
        error: null,
      };

    case "INITIALIZE_GUEST":
      return {
        ...state,
        isGuest: true,
        loading: false,
      };

    default:
      return state;
  }
}

export interface GuestCheckoutData {
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phoneNumber?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;

  // Guest-specific methods
  initializeGuestSession: () => void;
  convertGuestToUser: (userData: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  requireAuthForCheckout: () => boolean;
  canProceedAsGuest: () => boolean;

  // Checkout helpers
  isReadyForCheckout: (hasGuestData?: boolean) => boolean;
  getCheckoutUserData: () => User | GuestCheckoutData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Generate or retrieve guest session ID
  const generateGuestSessionId = useCallback(() => {
    const existingId = localStorage.getItem("guest_session_id");
    if (existingId) {
      return existingId;
    }

    const newId = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("guest_session_id", newId);
    return newId;
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Check for existing auth token
        const token = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          try {
            // Verify token is still valid by fetching profile
            const user = await api.getProfile();
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            return;
          } catch (error) {
            // Token is invalid, clear it
            api.clearAuth();
          }
        }

        // Initialize as guest
        const guestSessionId = generateGuestSessionId();
        dispatch({ type: "SET_GUEST_SESSION", payload: guestSessionId });
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch({ type: "INITIALIZE_GUEST" });
      }
    };

    initializeAuth();
  }, [generateGuestSessionId]);

  // Initialize guest session
  const initializeGuestSession = useCallback(() => {
    const guestSessionId = generateGuestSessionId();
    dispatch({ type: "SET_GUEST_SESSION", payload: guestSessionId });
  }, [generateGuestSessionId]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const result = await api.login(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: result.user });

      // Clear guest session since user is now authenticated
      localStorage.removeItem("guest_session_id");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Register function
  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const result = await api.register(email, password, name);
        dispatch({ type: "LOGIN_SUCCESS", payload: result.user });

        // Clear guest session since user is now authenticated
        localStorage.removeItem("guest_session_id");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      // Reinitialize as guest
      initializeGuestSession();
    }
  }, [initializeGuestSession]);

  // Update profile function
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      const updatedUser = await api.updateProfile(data);
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Profile update failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await api.getProfile();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      initializeGuestSession();
    }
  }, [initializeGuestSession]);

  // Convert guest to user (during checkout or by choice)
  const convertGuestToUser = useCallback(
    async (userData: { email: string; password: string; name: string }) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const result = await api.register(
          userData.email,
          userData.password,
          userData.name
        );
        dispatch({ type: "CONVERT_GUEST_TO_USER", payload: result.user });

        // Clear guest session
        localStorage.removeItem("guest_session_id");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Account creation failed";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  // Check if authentication is required for checkout
  const requireAuthForCheckout = useCallback(() => {
    // For your use case, auth is never required for checkout
    // Users can always proceed as guest
    return false;
  }, []);

  // Check if user can proceed as guest
  const canProceedAsGuest = useCallback(() => {
    return true; // Always allow guest checkout
  }, []);

  // Check if user is ready for checkout
  const isReadyForCheckout = useCallback(
    (hasGuestData: boolean = false) => {
      if (state.isAuthenticated) {
        return true; // Authenticated users are always ready
      }

      // For guests, they need to provide checkout data at checkout time
      return state.isGuest && !state.loading;
    },
    [state.isAuthenticated, state.isGuest, state.loading]
  );

  // Get user data for checkout (either authenticated user or guest data)
  const getCheckoutUserData = useCallback(() => {
    if (state.isAuthenticated && state.user) {
      return state.user;
    }

    // For guests, this will be null until they provide checkout info
    return null;
  }, [state.isAuthenticated, state.user]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    initializeGuestSession,
    convertGuestToUser,
    requireAuthForCheckout,
    canProceedAsGuest,
    isReadyForCheckout,
    getCheckoutUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
