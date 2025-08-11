import type { Brand } from '@/shared/definitions';

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
