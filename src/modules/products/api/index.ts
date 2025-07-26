import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { jsonApiInstance } from '../../../shared/api/api-instance';

export const PAGE_LIMIT = 12;

export type PaginatedProductsResult = {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
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
  reviews?: {
    date: string;
    rating: number;
    comment: string;
    reviewerEmail: string;
    reviewerName: string;
  }[];
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
  }: {
    limit?: number;
    page?: number;
  }) => {
    return queryOptions({
      queryKey: [productListApi.baseKey, 'list', page],
      queryFn: (meta) =>
        jsonApiInstance<PaginatedProductsResult>(
          `/products?limit=${limit}&skip=${(page - 1) * limit}`,
          {
            signal: meta.signal,
          }
        ).then((data) => {
          return PaginatedResultSchema.parse(data);
        }),
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

  //   createTodo: (data: TodoDto) => {
  //     return jsonApiInstance<TodoDto>(`/tasks`, {
  //       method: "POST",
  //       json: data
  //     });
  //   },
  //   updateTodo: (data: Partial<TodoDto> & { id: string }) => {
  //     return jsonApiInstance<TodoDto>(`/tasks/${data.id}`, {
  //       method: "PATCH",
  //       json: data
  //     });
  //   },
  //   deleteTodo: (id: string) => {
  //     return jsonApiInstance(`/tasks/${id}`, {
  //       method: "DELETE"
  //     });
  //   }
};
