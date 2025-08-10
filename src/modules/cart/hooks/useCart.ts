import { useQuery, useMutation } from '@tanstack/react-query';

import { useAppSelector } from '@/app/store';
import { authSlice } from '@/modules/auth/features/auth.slice';
import { queryClient } from '@/shared/api/query-client';
import { cartApi, type CartDto, type ProductIdentifier } from '../api';

export function useCart() {
  const userId = useAppSelector(authSlice.selectors.userId);

  // Query for cart data
  const { data, isLoading, isError, error } = useQuery({
    ...cartApi.getCartByUserIdQueryOptions({ userId: userId! }),
    enabled: !!userId,
  });

  // TODO: Add mutations for cart operations
  // These would typically call your API endpoints for updating cart

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: ProductIdentifier;
      quantity: number;
    }) => {
      // This would call your API to update quantity
      // For now, just simulate the API call
      console.log('Updating quantity:', productId, quantity);

      // You would implement actual API call here
      // return await cartApi.updateProductQuantity({ userId: userId!, productId, quantity });
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
      // This would call your API to remove item
      console.log('Removing item:', productId);

      // You would implement actual API call here
      // return await cartApi.removeProduct({ userId: userId!, productId });
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
      // This would call your API to add item to cart
      console.log('Adding to cart:', productId, quantity);

      // You would implement actual API call here
      // return await cartApi.addProduct({ userId: userId!, productId, quantity });
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({
        queryKey: [cartApi.baseKey, 'byId', userId],
      });
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
          (sum, product) => sum + product.discountedTotal,
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
          (sum, product) => sum + product.discountedTotal,
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
  console.log('%c data', 'color: green; font-weight: bold;', data);
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
    addToCart: addToCartMutation.mutate,

    // Computed values
    itemCount: data?.totalQuantity || 0,
    itemTypes: data?.totalProducts || 0,
    isEmpty: !data?.products || data.products.length === 0,
  };
}
