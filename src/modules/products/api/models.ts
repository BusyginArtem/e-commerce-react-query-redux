import type { Brand } from '@/shared/definitions';

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
