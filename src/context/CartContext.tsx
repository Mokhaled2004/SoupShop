import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Soup } from '../types';
import { cartService } from '../services/cartService';

interface CartContextType {
  cart: CartItem[];
  addToCart: (soup: Soup, quantity?: number) => void;
  removeFromCart: (soupId: number) => void;
  updateQuantity: (soupId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = cartService.getCart();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    setTotalItems(cart.reduce((total, item) => total + item.quantity, 0));
    setTotalPrice(cart.reduce((total, item) => total + (item.soup.price * item.quantity), 0));
  }, [cart]);

  const addToCart = (soup: Soup, quantity: number = 1) => {
    const updatedCart = cartService.addToCart(soup, quantity);
    setCart(updatedCart);
  };

  const removeFromCart = (soupId: number) => {
    const updatedCart = cartService.removeFromCart(soupId);
    setCart(updatedCart);
  };

  const updateQuantity = (soupId: number, quantity: number) => {
    const updatedCart = cartService.updateQuantity(soupId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    cartService.clearCart();
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};