import { useQuery } from '@tanstack/react-query';

import { productsApi } from '@/modules/products/api';

export function useCategories() {
  const { data, isLoading } = useQuery({
    ...productsApi.getProductCategoriesQueryOptions(),
  });

  return { categories: data, isLoading };
}
