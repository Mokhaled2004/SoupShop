import { CartItem, Soup } from '../types';

const CART_STORAGE_KEY = 'soup_cart';

export const cartService = {
  getCart: (): CartItem[] => {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  },

  saveCart: (cart: CartItem[]): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  addToCart: (soup: Soup, quantity: number = 1): CartItem[] => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.findIndex(item => item.soup.id === soup.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ soup, quantity });
    }

    cartService.saveCart(cart);
    return cart;
  },

  updateQuantity: (soupId: number, quantity: number): CartItem[] => {
    const cart = cartService.getCart();
    const itemIndex = cart.findIndex(item => item.soup.id === soupId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      cartService.saveCart(cart);
    }

    return cart;
  },

  removeFromCart: (soupId: number): CartItem[] => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.soup.id !== soupId);
    cartService.saveCart(updatedCart);
    return updatedCart;
  },

  clearCart: (): void => {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  getCartTotal: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + (item.soup.price * item.quantity), 0);
  },

  getCartItemCount: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
};