import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { jsonApiInstance } from '../../../shared/api/api-instance';
import { queryClient } from '@/shared/api/query-client';
import type {
  Order,
  PaginatedProductsResult,
  ProductDto,
  ProductIdentifier,
  SortBy,
} from './models';

export const PAGE_LIMIT = 12;

const ProductDtoSchema = z.object({
  id: z
    .number()
    .transform((val): ProductIdentifier => val as ProductIdentifier),
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
    sortBy = undefined,
    order = undefined,
  }: {
    limit?: number;
    page?: number;
    category?: string;
    query?: string;
    sortBy?: SortBy | undefined;
    order?: Order | undefined;
  }) => {
    return queryOptions({
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 1,
      queryKey: [
        productsApi.baseKey,
        'list',
        page,
        {
          category,
          query,
          sortBy,
          order,
        },
      ],
      queryFn: async (meta) => {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('skip', String((page - 1) * limit));
        if (sortBy) params.set('sortBy', sortBy);
        if (order) params.set('order', order);
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
    id: ProductIdentifier | undefined;
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
