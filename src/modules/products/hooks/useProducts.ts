import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// import { queryClient } from '@/shared/api/query-client';
import { productsApi } from '../api';
import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import { PAGE_LIMIT } from '../api/client';

export function useProducts() {
  const {
    getCurrentPage,
    getCurrentQuery,
    getCurrentCategory,
    getCurrentSortBy,
    getCurrentOrder,
  } = useAppSearchParams();
  const queryClient = useQueryClient();

  const query = getCurrentQuery();
  const currentPage = getCurrentPage();
  const category = getCurrentCategory();
  const sortBy = getCurrentSortBy();
  const order = getCurrentOrder();

  const { isPending, isError, data, isPlaceholderData } = useQuery({
    ...productsApi.getPaginatedProductListQueryOptions({
      page: currentPage,
      category,
      query,
      sortBy,
      order,
    }),
    placeholderData: keepPreviousData,
  });

  const handlePrefetchProducts = ({ page }: { page: number }) => {
    const { total, limit } = data || {
        total: 0,
        limit: 0,
      },
      isPrefetchAllowed = total > (page + 1) * limit;

    if (!isPlaceholderData && page > currentPage && isPrefetchAllowed) {
      queryClient.prefetchQuery({
        ...productsApi.getPaginatedProductListQueryOptions({
          page: page + 1,
          category,
          query,
          sortBy,
          order,
        }),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  };

  return {
    isPending,
    isError,
    products: data?.products || [],
    total: data?.total || 0,
    limit: data?.limit || PAGE_LIMIT,
    isPlaceholderData,
    prefetchProducts: handlePrefetchProducts,
  };
}
