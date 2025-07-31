// src/shared/utils/prefetch-utils.ts
import { store } from '@/app/store';
import { queryClient } from '@/shared/api/query-client';
import { authSlice } from '@/modules/auth/features/auth.slice';
import { usersApi } from '@/modules/auth/api';
import { cartApi } from '@/modules/cart/api';

export const prefetchUserData = async () => {
  const userId = getCurrentUserId();

  if (userId) {
    await Promise.all([
      queryClient.prefetchQuery({
        ...usersApi.getUserByIdQueryOptions({ userId }),
      }),

      queryClient.prefetchQuery({
        ...cartApi.getCartByUserIdQueryOptions({ userId }),
      }),
    ]);
  }

  return userId;
};

export const getCurrentUserId = () => {
  const currentState = store.getState();
  return authSlice.selectors.userId(currentState);
};

export const isUserAuthenticated = () => {
  return !!getCurrentUserId();
};
