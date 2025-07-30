import { useAppSelector } from '@/app/store';
import { usersApi } from '@/modules/auth/api';
import { authSlice } from '@/modules/auth/features/auth.slice';
import { useQuery } from '@tanstack/react-query';

export function useUserData() {
  const userId = useAppSelector(authSlice.selectors.userId);

  return useQuery({
    ...usersApi.getUserByIdQueryOptions({ userId: userId! }),
    enabled: !!userId,
  });
}
