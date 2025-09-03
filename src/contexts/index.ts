// contexts/index.ts - Barrel exports for cleaner imports

export { CartProvider, useCart, CartErrorBoundary } from "./CartContext";
export { AuthProvider, useAuth } from "./AuthContext";

// Re-export types for convenience
export type { GuestCheckoutData } from "./AuthContext";
