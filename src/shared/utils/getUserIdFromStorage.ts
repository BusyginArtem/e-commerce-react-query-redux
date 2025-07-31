import type { UserIdentifier } from '@/modules/auth/api';

export const getUserIdFromStorage = (): UserIdentifier | undefined => {
  try {
    const storedUserId = localStorage.getItem('userId');

    return storedUserId ? (Number(storedUserId) as UserIdentifier) : undefined;
  } catch (error) {
    console.warn('Failed to read userId from localStorage:', error);
    return undefined;
  }
};
