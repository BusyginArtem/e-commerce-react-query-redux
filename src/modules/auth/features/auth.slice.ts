import { rootReducer } from '@/app/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserIdentifier } from '../api';

type AuthState = {
  userId: UserIdentifier | undefined;
  error?: string;
};

const initialState = {
  userId: undefined,
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    userId: (state) => state.userId,
    selectError: (state) => state.error,
  },
  reducers: {
    addUser: (state, action: PayloadAction<{ userId: number }>) => {
      state.userId = action.payload.userId as UserIdentifier;
    },
    removeUser: (state) => {
      state.userId = undefined;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
}).injectInto(rootReducer);
