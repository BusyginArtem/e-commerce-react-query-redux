import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store';

import { cartSlice } from '../features/cart.slice';
import {
  productsApi,
  type ProductDto,
  // type ProductIdentifier,
} from '@/modules/products/api';

// import { cartStorageHelpers } from '../features/helpers';

const generatePercentageOnQuantityAndPrice = (
  price: number,
  quantity: number
) => {
  let discount = 5; // base 5% discount

  // Add discount based on price tiers
  if (price > 50) discount += 5;
  if (price > 100) discount += 10;

  // Add discount based on quantity tiers
  if (quantity > 3) discount += 5;
  if (quantity > 5) discount += 10;
  if (quantity > 7) discount += 15;

  return discount;
};

export function useCartData() {
  const queryClient = useQueryClient();

  const query = queryClient.getQueryCache().find({
    queryKey: [productsApi.baseKey, 'list'],
    exact: false,
  }) as { state: { data?: { products: ProductDto[] } } } | undefined;

  const cartStoredProducts = useAppSelector(cartSlice.selectors.selectProducts);
  const itemCount = useAppSelector(cartSlice.selectors.selectTotalProducts);
  const isEmpty = useAppSelector(cartSlice.selectors.selectIsEmpty);

  const cartProducts = useMemo(
    () =>
      query?.state.data?.products
        ? cartStoredProducts
            .map((cartStoredProduct) => {
              const product = query?.state.data?.products.find(
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
    [cartStoredProducts, query?.state.data?.products]
  );

  console.log(
    '%c cartProducts',
    'color: green; font-weight: bold;',
    cartProducts
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

  // const removeProductFromCart = (productId: ProductIdentifier) => {
  //   dispatch(cartSlice.actions.removeProductFromCart({ productId }));
  //   // cartStorageHelpers.saveCartToStorage(
  //   //   productIds.filter((id) => id !== productId)
  //   // );
  // };

  // const addProductToCart = ({
  //   productId,
  // }: {
  //   productId: ProductIdentifier;
  // }) => {
  //   dispatch(cartSlice.actions.addProductToCart({ productId }));
  //   // cartStorageHelpers.saveCartToStorage([productId]);
  // };

  return {
    products: cartProducts,
    total,
    itemCount,
    isEmpty,
    discountedTotal,
    // addProductToCart,
    // removeProductFromCart,
    // updateProductQuantity: () => {},
  };
}
