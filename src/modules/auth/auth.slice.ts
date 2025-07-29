import { rootReducer } from '@/app/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  userId: number | undefined;
};

const initialState = {
  userId: Number(localStorage.getItem('userId')) || undefined,
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ userId: number }>) => {
      state.userId = action.payload.userId;
    },
    removeUser: (state) => {
      state.userId = undefined;
    },
  },
}).injectInto(rootReducer);
