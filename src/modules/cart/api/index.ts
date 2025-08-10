import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { jsonApiInstance } from '../../../shared/api/api-instance';
import type { Brand } from '@/shared/definitions';
import type { UserIdentifier } from '@/modules/auth/api';

export type CartIdentifier = Brand<number, 'CART_IDENTIFIER'>;
export type ProductIdentifier = Brand<number, 'PRODUCT_IDENTIFIER'>;

export type PaginatedCartsResult = {
  carts: CartDto[];
  total: number;
  skip: number;
  limit: number;
};

export type CartProductDto = {
  id: ProductIdentifier;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type CartDto = {
  id: CartIdentifier;
  products: CartProductDto[];
  total: number;
  discountedTotal: number;
  userId: UserIdentifier;
  totalProducts: number;
  totalQuantity: number;
};

export const CartProductDtoSchema = z.object({
  id: z
    .number()
    .transform((val): ProductIdentifier => val as ProductIdentifier),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number(),
  thumbnail: z.url(),
});

export const CartDtoSchema = z.object({
  id: z.number().transform((val): CartIdentifier => val as CartIdentifier),
  products: z.array(CartProductDtoSchema),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number().transform((val): UserIdentifier => val as UserIdentifier),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

const PaginatedResultSchema = z.object({
  carts: z.array(CartDtoSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const cartApi = {
  baseKey: 'cart',

  getCartByUserIdQueryOptions: ({ userId }: { userId: UserIdentifier }) => {
    return queryOptions({
      queryKey: [cartApi.baseKey, 'byId', userId],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedCartsResult>(`/carts/user/${userId}`, {
          signal: meta.signal,
        })
          .then((data) => {
            if (!PaginatedResultSchema.parse(data))
              throw new Error('Invalid data');

            return CartDtoSchema.parse(data.carts[0]);
          })
          .catch((error) => console.error(error)),
    });
  },
};
