import { rootReducer } from '@/app/store';
import type { ProductDto } from '@/modules/products/api';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CartState = {
  products: ProductDto[];
  discountedTotal: number;
  total: number;
};

const initialState = {
  products: [],
  discountedTotal: 0,
  total: 0,
} as CartState;

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  selectors: {
    selectProducts: (state) => state.products,
    selectCartTotal: (state) => state.total + state.discountedTotal,
    selectTotalProducts: (state) => state.products.length,
  },
  reducers: {
    addProduct: (state, action: PayloadAction<{ product: ProductDto }>) => {
      state.products.push(action.payload.product);
    },
  },
}).injectInto(rootReducer);
