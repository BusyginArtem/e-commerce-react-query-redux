import { queryClient } from '@/shared/api/query-client';
import { authSlice } from '../features/auth.slice';
import type { AppThunk } from '@/app/store';
import { usersApi, type UserIdentifier } from '../api';

export const logoutThunk =
  ({ userId }: { userId: UserIdentifier | undefined }): AppThunk =>
  async (dispatch) => {
    if (userId !== undefined) {
      dispatch(authSlice.actions.removeUser());

      queryClient.removeQueries({
        queryKey: [usersApi.getUserByIdQueryOptions({ userId }).queryKey],
        type: 'active',
      });

      localStorage.removeItem('userId');
    }
  };
