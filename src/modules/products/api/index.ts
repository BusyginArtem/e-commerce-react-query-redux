import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { jsonApiInstance } from '../../../shared/api/api-instance';
import { queryClient } from '@/shared/api/query-client';

export const PAGE_LIMIT = 12;

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
  id: number;
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

export const productListApi = {
  baseKey: 'products',
  getPaginatedProductListQueryOptions: ({
    limit = PAGE_LIMIT,
    page = 1,
    category = '',
    query = '',
  }: {
    limit?: number;
    page?: number;
    category?: string;
    query?: string;
  }) => {
    return queryOptions({
      queryKey: [
        productListApi.baseKey,
        'list',
        page,
        category ? category : '',
        query ? query : '',
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

  getTodoListInfinityQueryOptions: () => {
    return infiniteQueryOptions({
      queryKey: [productListApi.baseKey, 'list'],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedProductsResult>(
          `/products?limit=${PAGE_LIMIT}&skip=${meta.pageParam || 0}`,
          {
            signal: meta.signal,
          }
        ).then((data) => {
          return PaginatedResultSchema.parse(data);
        }),
      initialPageParam: 1,
      getNextPageParam: (result) => result.skip + result.limit,
      select: (result) => result.pages.flatMap((page) => page.products),
    });
  },

  getProductByIdQueryOptions: ({ id, page }: { id: number; page: number }) => {
    return queryOptions({
      queryKey: [productListApi.baseKey, 'entity', id],
      queryFn: (meta) =>
        jsonApiInstance<ProductDto>(`/products/${id}`, {
          signal: meta.signal,
        }).then((data) => {
          return ProductDtoSchema.parse(data);
        }),

      initialData: () => {
        const data = queryClient.getQueryData<PaginatedProductsResult>([
          productListApi.baseKey,
          'list',
          page,
        ]);

        if (!data) return undefined;
        return data?.products?.find((p) => p.id === Number(id));
      },
    });
  },

  getProductCategoriesQueryOptions: () => {
    return queryOptions({
      queryKey: [productListApi.baseKey, 'categories'],
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
