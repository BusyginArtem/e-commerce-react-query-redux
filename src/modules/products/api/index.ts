import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { jsonApiInstance } from '../../../shared/api/api-instance';
import { queryClient } from '@/shared/api/query-client';

export type UserDto = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  image: string;
  fullName?: string;
  displayName?: string;
  profileLink?: string;
};

export const UserDtoSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  image: z.string().url(),
  fullName: z.string().optional(),
  displayName: z.string().optional(),
  profileLink: z.string().optional(),
});

export const usersApi = {
  baseKey: 'users',

  getUserByIdQueryOptions: ({ userId }: { userId: number }) => {
    return queryOptions({
      queryKey: [usersApi.baseKey, 'byId', userId],
      queryFn: (meta) =>
        jsonApiInstance<UserDto>(`/users/${userId}`, {
          signal: meta.signal,
        }).then((data) => {
          return UserDtoSchema.parse(data);
        }),
    });
  },
};
