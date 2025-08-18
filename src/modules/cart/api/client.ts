import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { jsonApiInstance } from '../../../shared/api/api-instance';
import type { UserIdentifier } from '@/modules/auth/api';
import type { ProductIdentifier } from '@/modules/products/api';
import type { CartIdentifier, PaginatedCartsResult } from './models';

const CartProductDtoSchema = z.object({
  id: z
    .number()
    .transform((val): ProductIdentifier => val as ProductIdentifier),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number().optional(),
  thumbnail: z.url(),
});

const CartDtoSchema = z.object({
  id: z.number().transform((val): CartIdentifier => val as CartIdentifier),
  products: z.array(CartProductDtoSchema),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number().transform((val): UserIdentifier => val as UserIdentifier),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

const DeletedCartDtoSchema = z.object({
  ...CartDtoSchema,
  isDeleted: z.boolean(),
  deletedOn: z.string(),
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
      staleTime: 1000 * 60 * 60 * 24,
      queryFn: (meta) =>
        jsonApiInstance<PaginatedCartsResult>(`/carts/user/${userId}`, {
          signal: meta.signal,
        }).then((data) => {
          if (!PaginatedResultSchema.parse(data))
            throw new Error('Invalid data');

          return CartDtoSchema.parse(data.carts[0]);
        }),
      // .catch((error) => console.error(error)),
    });
  },

  updateProductQuantity: async ({
    userId,
    cartId,
    productId,
    quantity,
  }: {
    userId: UserIdentifier;
    cartId: CartIdentifier;
    productId: ProductIdentifier;
    quantity: number;
  }) => {
    return jsonApiInstance(`/carts/${cartId}`, {
      json: {
        merge: true,
        userId,
        products: [{ id: productId, quantity }],
      },
      method: 'PUT',
    }).then((data) => CartDtoSchema.parse(data));
  },
  createOrder: async ({
    userId,
    cartProducts,
  }: {
    userId: UserIdentifier;
    cartProducts: {
      id: ProductIdentifier;
      quantity: number;
    }[];
  }) => {
    return jsonApiInstance('/carts/add', {
      json: {
        userId,
        products: cartProducts,
      },
      method: 'POST',
    }).then((data) => CartDtoSchema.parse(data));
  },

  // createCart: async ({
  //   userId,
  //   productId,
  //   quantity,
  // }: {
  //   userId: UserIdentifier;
  //   productId: ProductIdentifier;
  //   quantity: number;
  // }) => {
  //   return jsonApiInstance('/carts/add', {
  //     json: {
  //       userId,
  //       products: [{ id: productId, quantity }],
  //     },
  //     method: 'POST',
  //   }).then((data) => CartDtoSchema.parse(data));
  // },

  deleteCart: async ({ cartId }: { cartId: CartIdentifier }) => {
    return jsonApiInstance(`/carts/${cartId}`, {
      method: 'DELETE',
    }).then((data) => DeletedCartDtoSchema.parse(data));
  },
  addProduct: async ({
    userId,
    cartId,
    productId,
    quantity,
  }: {
    userId: UserIdentifier;
    cartId: CartIdentifier;
    productId: ProductIdentifier;
    quantity: number;
  }) => {
    return jsonApiInstance(`/carts/${cartId}`, {
      json: {
        userId,
        products: [{ id: productId, quantity }],
      },
      method: 'PATCH',
    }).then((data) => CartDtoSchema.parse(data));
  },
  removeProduct: async ({
    userId,
    cartId,
    productId,
  }: {
    userId: UserIdentifier;
    cartId: CartIdentifier;
    productId: ProductIdentifier;
  }) => {
    return jsonApiInstance(`/carts/${cartId}`, {
      json: {
        merge: true,
        userId,
        products: [{ id: productId, quantity: 0 }],
      },
      method: 'PUT',
    }).then((data) => CartDtoSchema.parse(data));
  },
};
