import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAppSelector } from '@/app/store';
import { authSlice } from '@/modules/auth/features/auth.slice';
import { cartApi, type CartDto } from '../api';
import type { ProductIdentifier } from '@/modules/products/api';

export function useCart() {
  const userId = useAppSelector(authSlice.selectors.userId);
  const queryClient = useQueryClient();
  console.log('useCart');

  // Query for cart data
  const { data, isLoading, isError, error } = useQuery({
    ...cartApi.getCartByUserIdQueryOptions({ userId: userId! }),
    enabled: !!userId,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: ProductIdentifier;
      quantity: number;
    }) => {
      return await cartApi.updateProductQuantity({
        userId: userId!,
        cartId: data!.id,
        productId,
        quantity,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({
        queryKey: [cartApi.baseKey, 'byId', userId],
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: ProductIdentifier) => {
      return await cartApi.removeProduct({
        userId: userId!,
        productId,
        cartId: data!.id,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({
        queryKey: [cartApi.baseKey, 'byId', userId],
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: ProductIdentifier;
      quantity?: number;
    }) => {
      // You would implement actual API call here
      return await cartApi.addProduct({
        userId: userId!,
        productId,
        quantity,
        cartId: data!.id,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [cartApi.baseKey, 'byId', userId],
      });

      queryClient.setQueryData([cartApi.baseKey, 'byId', userId], () => {
        if (!data) return data;

        const products = data.products;

        const total = products.reduce((sum, product) => sum + product.total, 0);
        const discountedTotal = products.reduce(
          (sum, product) => sum + (product?.discountedTotal ?? 0),
          0
        );
        const totalQuantity = products.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        return {
          ...data,
          total,
          discountedTotal,
          totalQuantity,
          totalProducts: products.length,
        };
      });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData([
        cartApi.baseKey,
        'byId',
        userId,
      ]);

      // Return a context with the previous and new todo
      return { previousCart };
    },
    onError: (_, __, context) => {
      if (context?.previousCart !== undefined) {
        // queryClient.setQueryData(
        //   [cartApi.baseKey, 'byId', userId],
        //   context.previousCart
        // );
      }
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({
        queryKey: [cartApi.baseKey, 'byId', userId],
      });
    },
  });

  const createCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: ProductIdentifier;
      quantity?: number;
    }) => {
      return await cartApi.createCart({
        userId: userId!,
        productId,
        quantity,
      });
    },
    // onMutate: async () => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({
    //     queryKey: [cartApi.baseKey, 'byId', userId],
    //   });

    //   // Snapshot the previous value
    //   const previousCart = queryClient.getQueryData([
    //     cartApi.baseKey,
    //     'byId',
    //     userId,
    //   ]);

    //   // Return a context with the previous and new todo
    //   return { previousCart };
    // },
    // onError: (_, __, context) => {
    //   if (context?.previousCart !== undefined) {
    //     queryClient.setQueryData(
    //       [cartApi.baseKey, 'byId', userId],
    //       context.previousCart
    //     );
    //   }
    // },
    onSuccess: (data) => {
      // TODO remove in production
      queryClient.setQueryData<CartDto>(
        [cartApi.baseKey, 'byId', userId],
        data
      );

      // TODO uncomment in production
      // Invalidate and refetch cart data
      // return queryClient.invalidateQueries({
      //   queryKey: [cartApi.baseKey, 'byId', userId],
      // });
    },
  });

  // Optimistic update for quantity changes
  const updateQuantityOptimistic = (
    productId: ProductIdentifier,
    newQuantity: number
  ) => {
    if (!userId || !data) return;

    // Update the cache optimistically
    queryClient.setQueryData<CartDto>(
      [cartApi.baseKey, 'byId', userId],
      (oldData) => {
        if (!oldData) return oldData;

        const updatedProducts = oldData.products.map((product) => {
          if (product.id === productId) {
            const updatedProduct = {
              ...product,
              quantity: newQuantity,
              total: product.price * newQuantity,
              discountedTotal:
                product.price *
                newQuantity *
                (1 - product.discountPercentage / 100),
            };
            return updatedProduct;
          }
          return product;
        });

        // Recalculate totals
        const total = updatedProducts.reduce(
          (sum, product) => sum + product.total,
          0
        );
        const discountedTotal = updatedProducts.reduce(
          (sum, product) => sum + (product.discountedTotal ?? 0),
          0
        );
        const totalQuantity = updatedProducts.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        return {
          ...oldData,
          products: updatedProducts,
          total,
          discountedTotal,
          totalQuantity,
        };
      }
    );

    // Then trigger the actual API call
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Optimistic remove item
  const removeItemOptimistic = (productId: ProductIdentifier) => {
    if (!userId || !data) return;

    // Update the cache optimistically
    queryClient.setQueryData<CartDto>(
      [cartApi.baseKey, 'byId', userId],
      (oldData) => {
        if (!oldData) return oldData;

        const updatedProducts = oldData.products.filter(
          (product) => product.id !== productId
        );

        // Recalculate totals
        const total = updatedProducts.reduce(
          (sum, product) => sum + product.total,
          0
        );
        const discountedTotal = updatedProducts.reduce(
          (sum, product) => sum + (product?.discountedTotal ?? 0),
          0
        );
        const totalQuantity = updatedProducts.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        return {
          ...oldData,
          products: updatedProducts,
          total,
          discountedTotal,
          totalQuantity,
          totalProducts: updatedProducts.length,
        };
      }
    );

    // Then trigger the actual API call
    removeItemMutation.mutate(productId);
  };

  const addToCart = async ({
    productId,
    quantity,
  }: {
    productId: ProductIdentifier;
    quantity?: number;
  }) => {
    if (!data) {
      return createCartMutation.mutate({ productId, quantity });
    } else {
      return addToCartMutation.mutate({ productId, quantity });
    }
  };

  return {
    // Query state
    cart: data,
    isLoading: isLoading,
    isError: isError,
    error,

    // Mutation state
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isAddingToCart: addToCartMutation.isPending,

    // Actions
    updateQuantity: updateQuantityOptimistic,
    removeItem: removeItemOptimistic,
    addToCart: addToCart,

    // Computed values
    itemCount: data?.totalQuantity || 0,
    itemTypes: data?.totalProducts || 0,
    isEmpty: !data?.products || data.products.length === 0,
  };
}
