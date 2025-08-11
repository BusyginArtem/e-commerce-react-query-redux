import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { jsonApiInstance } from '../../../shared/api/api-instance';
import { queryClient } from '@/shared/api/query-client';
import type { Brand } from '@/shared/definitions';

export const PAGE_LIMIT = 12;

export type ProductIdentifier = Brand<number, 'PRODUCT_IDENTIFIER'>;

export type PaginatedProductsResult = {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductReview = {
  date: string;
  rating: number;
  comment: string;
  reviewerEmail: string;
  reviewerName: string;
};

export type ProductDto = {
  id: ProductIdentifier;
  title: string;
  description: string;
  category: string;
  price: number;
  brand?: string;
  rating: number;
  stock: number;
  images: string[];
  thumbnail: string;
  reviews?: ProductReview[];
};

const ProductDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  brand: z.string().optional(),
  rating: z.number(),
  stock: z.number(),
  images: z.array(z.string()),
  thumbnail: z.string(),
  reviews: z
    .array(
      z.object({
        date: z.string(),
        rating: z.number(),
        comment: z.string(),
        reviewerEmail: z.string(),
        reviewerName: z.string(),
      })
    )
    .optional(),
});

const PaginatedResultSchema = z.object({
  products: z.array(ProductDtoSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const productsApi = {
  baseKey: 'products',
  getPaginatedProductListQueryOptions: ({
    limit = PAGE_LIMIT,
    page = 1,
    category = undefined,
    query = undefined,
  }: {
    limit?: number;
    page?: number;
    category?: string;
    query?: string;
  }) => {
    return queryOptions({
      queryKey: [
        productsApi.baseKey,
        'list',
        page,
        {
          category,
          query,
        },
      ],
      queryFn: async (meta) => {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('skip', String((page - 1) * limit));
        if (query && !category) params.set('q', query);

        const url = `/products${category && !query ? `/category/${category}` : ''}${query && !category ? `/search` : ''}?${params.toString()}`;

        const data = await jsonApiInstance<PaginatedProductsResult>(url, {
          signal: meta.signal,
        });
        return PaginatedResultSchema.parse(data);
      },
    });
  },

  getProductByIdQueryOptions: ({
    id,
    page,
  }: {
    id: number | undefined;
    page: number;
  }) => {
    return queryOptions({
      queryKey: [productsApi.baseKey, 'entity', id],
      queryFn: (meta) =>
        jsonApiInstance<ProductDto>(`/products/${id}`, {
          signal: meta.signal,
        }).then((data) => {
          return ProductDtoSchema.parse(data);
        }),

      initialData: () => {
        const data = queryClient.getQueryData<PaginatedProductsResult>([
          productsApi.baseKey,
          'list',
          page,
        ]);

        if (!data) return undefined;
        return data?.products?.find((p) => p.id === Number(id));
      },
      enabled: Boolean(id),
    });
  },

  getProductCategoriesQueryOptions: () => {
    return queryOptions({
      queryKey: [productsApi.baseKey, 'categories'],
      queryFn: (meta) =>
        jsonApiInstance<string[]>(`/products/category-list`, {
          signal: meta.signal,
        }).then((data) => {
          return z.array(z.string()).parse(data);
        }),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  },
};
