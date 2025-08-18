import { MutationObserver, useMutationState } from '@tanstack/react-query';
import { toast } from 'sonner';

import { type AppThunk } from '@/app/store';
import { queryClient } from '@/shared/api/query-client';

import { cartApi } from '../api';
import { cartSlice } from '../features/cart.slice';

const mutationKey = ['createOrder'];

export const createOrderThunk = (): AppThunk => async (dispatch, getState) => {
  const cartProducts = getState().cart.products;
  const userId = getState().auth.userId;

  const cart = await new MutationObserver(queryClient, {
    mutationKey,
    mutationFn: cartApi.createOrder,
    onError: () => {
      toast.error('Order creation failed.', {
        richColors: true,
      });
    },
  }).mutate({
    userId: userId!,
    cartProducts: cartProducts,
  });

  if (!cart.id) {
    toast.error('Order creation failed.', {
      richColors: true,
    });

    return;
  }

  toast.success('Order has been created.', {
    richColors: true,
  });

  dispatch(cartSlice.actions.clearCart());
};

export const useCreateOrderLoading = () => {
  const variables = useMutationState({
    filters: { mutationKey },
    select: (mutation) => mutation.state.status,
  });

  return variables.at(-1) === 'pending';
};
