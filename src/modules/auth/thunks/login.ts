import { MutationObserver, useMutationState } from '@tanstack/react-query';

import type { AppThunk } from '@/app/store';
import { queryClient } from '@/shared/api/query-client';
import { authSlice } from '../features/auth.slice';
import { usersApi } from '../api';

const mutationKey = ['login'];

export const loginThunk =
  (username: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      const user = await new MutationObserver(queryClient, {
        mutationKey,
        mutationFn: usersApi.loginUser,
      }).mutate({
        username,
        password,
      });

      if (user?.id) {
        dispatch(
          authSlice.actions.addUser({
            userId: user.id,
          })
        );

        queryClient.setQueryData(
          usersApi.getUserByIdQueryOptions({ userId: user.id }).queryKey,
          user
        );
        localStorage.setItem('userId', user.id.toString());
      } else {
        dispatch(
          authSlice.actions.setError(
            'Login failed. Please check your credentials.'
          )
        );
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        dispatch(authSlice.actions.setError(error.message || 'Login failed'));
      }
    }
  };

export const useLoginLoading = () => {
  const variables = useMutationState({
    filters: { mutationKey },
    select: (mutation) => mutation.state.status,
  });

  return variables[0] === 'pending';
};
