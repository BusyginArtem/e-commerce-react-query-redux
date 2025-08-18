import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store';

import { cartSlice } from '../features/cart.slice';
import { productsApi, type ProductDto } from '@/modules/products/api';

const generatePercentageOnQuantityAndPrice = (
  price: number,
  quantity: number
) => {
  let discount = 5;

  if (price > 50) discount += 5;
  if (price > 100) discount += 10;

  if (quantity > 3) discount += 5;
  if (quantity > 5) discount += 10;
  if (quantity > 7) discount += 15;

  return discount;
};

export function useCartData() {
  const queryClient = useQueryClient();

  const queryProducts = queryClient
    .getQueryCache()
    .findAll({
      queryKey: [productsApi.baseKey, 'list'],
      exact: false,
    })
    .reduce((acc, query) => {
      const data = query.state.data as { products?: ProductDto[] } | undefined;

      return data && Array.isArray(data.products)
        ? [...acc, ...data.products]
        : acc;
    }, [] as ProductDto[]);

  const cartStoredProducts = useAppSelector(cartSlice.selectors.products);
  const itemCount = useAppSelector(cartSlice.selectors.totalProductItems);
  const isEmpty = useAppSelector(cartSlice.selectors.cartIsEmpty);

  const cartProducts = useMemo(
    () =>
      queryProducts
        ? cartStoredProducts
            .map((cartStoredProduct) => {
              const product = queryProducts.find(
                (clientProduct) => clientProduct.id === cartStoredProduct.id
              );

              if (!product) return null;

              const discountPercentage = generatePercentageOnQuantityAndPrice(
                product.price,
                cartStoredProduct.quantity
              );

              return {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: cartStoredProduct.quantity,
                total: product.price * cartStoredProduct.quantity,
                discountedTotal:
                  product.price *
                  cartStoredProduct.quantity *
                  (1 - discountPercentage / 100),
                discountPercentage,
              };
            })
            .filter((product) => !!product)
        : [],
    [cartStoredProducts, queryProducts]
  );

  const total = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      if (!product) return sum;
      return sum + (product.total ?? 0);
    }, 0);
  }, [cartProducts]);

  const discountedTotal = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      if (!product) return sum;
      return sum + (product.discountedTotal ?? 0);
    }, 0);
  }, [cartProducts]);

  return {
    products: cartProducts,
    total,
    itemCount,
    isEmpty,
    discountedTotal,
  };
}
