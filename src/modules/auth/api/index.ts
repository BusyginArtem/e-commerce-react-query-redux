import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { jsonApiInstance } from '../../../shared/api/api-instance';
import type { Brand } from '@/shared/defenitions';

export type UserIdentifier = Brand<number, 'USER_IDENTIFIER'>;

export type UserDto = {
  id: UserIdentifier;
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

const UserIdentifierSchema = z.preprocess(
  (val) => Number(val),
  z.number()
) as unknown as z.ZodType<UserIdentifier>;

export const UserDtoSchema = z.object({
  id: UserIdentifierSchema,
  username: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  image: z.url(),
  fullName: z.string().optional(),
  displayName: z.string().optional(),
  profileLink: z.string().optional(),
});

export const usersApi = {
  baseKey: 'users',

  getUserByIdQueryOptions: ({ userId }: { userId: UserIdentifier }) => {
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
  loginUser: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response = await jsonApiInstance<UserDto>('/auth/login', {
      method: 'POST',
      json: { username, password, expiresInMins: 60 },
      // credentials: 'include',
    });

    return UserDtoSchema.parse(response);
  },
};
