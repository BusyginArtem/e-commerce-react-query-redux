import type { ProductIdentifier } from '@/modules/products/api';
import type { CartDto } from '../api';

export const cartStorageHelpers = {
  STORAGE_KEY: 'shopping_cart',

  saveCartToStorage: (productIds: ProductIdentifier[]): void => {
    try {
      const cartData = {
        productIds,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        cartStorageHelpers.STORAGE_KEY,
        JSON.stringify(cartData)
      );
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  },

  loadCartFromStorage: (): CartDto[] => {
    try {
      const stored = localStorage.getItem(cartStorageHelpers.STORAGE_KEY);
      if (!stored) return [];

      const cartData = JSON.parse(stored);

      if (cartData.timestamp) {
        const storedDate = new Date(cartData.timestamp);
        const now = new Date();
        const daysDiff =
          (now.getTime() - storedDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff > 30) {
          cartStorageHelpers.clearCartFromStorage();
          return [];
        }
      }

      return Array.isArray(cartData.productIds) ? cartData.productIds : [];
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      return [];
    }
  },

  clearCartFromStorage: (): void => {
    try {
      localStorage.removeItem(cartStorageHelpers.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear cart from localStorage:', error);
    }
  },
};
