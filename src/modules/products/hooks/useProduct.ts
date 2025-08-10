import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api';

export function useProduct({ id }: { id: number | undefined }) {
  const { getCurrentPage } = useAppSearchParams();

  const currentPage = getCurrentPage();

  const {
    isPending,
    isError,
    data: product,
  } = useQuery({
    ...productsApi.getProductByIdQueryOptions({
      page: currentPage,
      id,
    }),
  });

  return { isPending, isError, product };
}
