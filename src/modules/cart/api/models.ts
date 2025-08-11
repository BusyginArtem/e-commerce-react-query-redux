import type { Brand } from '@/shared/definitions';
import type { UserIdentifier } from '@/modules/auth/api';
import type { ProductIdentifier } from '@/modules/products/api';

export type CartIdentifier = Brand<number, 'CART_IDENTIFIER'>;

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
  discountedTotal?: number;
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
