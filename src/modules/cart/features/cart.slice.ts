import { rootReducer } from '@/app/store';
import type { ProductIdentifier } from '@/modules/products/api';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  products: { id: ProductIdentifier; quantity: number }[];
};

const initialState: CartState = {
  products: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  selectors: {
    products: (state) => state.products,
    totalProductItems: (state) =>
      state.products.reduce((acc, product) => acc + product.quantity, 0),
    cartIsEmpty: (state) => state.products.length === 0,
  },
  reducers: {
    addProductToCart: (
      state,
      action: PayloadAction<{ productId: ProductIdentifier }>
    ) => {
      if (
        state.products.some(
          (product) => product.id === action.payload.productId
        )
      ) {
        return;
      }

      state.products.push({ id: action.payload.productId, quantity: 1 });
    },
    removeProductFromCart: (
      state,
      action: PayloadAction<{ productId: ProductIdentifier }>
    ) => {
      if (
        !state.products.some(
          (product) => product.id === action.payload.productId
        )
      ) {
        return;
      }

      state.products = state.products.filter(
        (product) => product.id !== action.payload.productId
      );
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: ProductIdentifier; quantity: number }>
    ) => {
      state.products = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          return { ...product, quantity: action.payload.quantity };
        }

        return product;
      });
    },
    clearCart: (state) => {
      state.products = [];
    },
  },
}).injectInto(rootReducer);
