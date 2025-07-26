'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api, CartItem } from '@/lib/api';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  syncing: boolean; // For API sync operations
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SYNC_SUCCESS'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: true,
  error: null,
  syncing: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    
    case 'LOAD_CART': {
      const items = action.payload;
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items,
        total,
        itemCount,
        loading: false,
      };
    }
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      let newItems: CartItem[];
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }
    
    case 'UPDATE_ITEM': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        total,
        itemCount,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    
    case 'SYNC_SUCCESS':
      return {
        ...state,
        items: action.payload,
        syncing: false,
        error: null,
      };
    
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addToCart: (product: { id: string; name: string; price: number; image?: string }, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: items });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.loading) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, state.loading]);

  // Sync with server when user is authenticated
  const syncWithServer = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      dispatch({ type: 'SET_SYNCING', payload: true });
      const serverCart = await api.getCart();
      
      // Merge local cart with server cart (prioritize local for now)
      const mergedCart = [...state.items];
      serverCart.forEach(serverItem => {
        const localItem = mergedCart.find(item => item.productId === serverItem.productId);
        if (!localItem) {
          mergedCart.push(serverItem);
        }
      });
      
      dispatch({ type: 'SYNC_SUCCESS', payload: mergedCart });
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart' });
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [state.items]);

  // Add item to cart
  const addToCart = useCallback(async (
    product: { id: string; name: string; price: number; image?: string },
    quantity: number = 1
  ) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      quantity,
      price: product.price,
      name: product.name,
      image: product.image,
    };

    // Optimistically update local state
    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    // Sync with server if authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await api.addToCart(product.id, quantity);
      } catch (error) {
        console.error('Error adding to server cart:', error);
        // Don't revert local change, just show error
        dispatch({ type: 'SET_ERROR', payload: 'Failed to sync with server' });
      }
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    // Optimistically update local state
    dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity } });

    // Sync with server if authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        if (quantity > 0) {
          await api.updateCartItem(productId, quantity);
        } else {
          await api.removeFromCart(productId);
        }
      } catch (error) {
        console.error('Error updating server cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to sync with server' });
      }
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId: string) => {
    // Optimistically update local state
    dispatch({ type: 'REMOVE_ITEM', payload: productId });

    // Sync with server if authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await api.removeFromCart(productId);
      } catch (error) {
        console.error('Error removing from server cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to sync with server' });
      }
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    // Optimistically update local state
    dispatch({ type: 'CLEAR_CART' });

    // Sync with server if authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await api.clearCart();
      } catch (error) {
        console.error('Error clearing server cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to sync with server' });
      }
    }
  }, []);

  // Get quantity of specific item
  const getItemQuantity = useCallback((productId: string): number => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  // Check if item is in cart
  const isInCart = useCallback((productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  }, [state.items]);

  // Auto-sync when user logs in
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && e.newValue) {
        // User logged in, sync cart
        syncWithServer();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncWithServer]);

  const value: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncWithServer,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Error boundary component for cart-related errors
export function CartErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}