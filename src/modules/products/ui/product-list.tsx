import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productListApi } from '../api';
import { queryClient } from '@/shared/api/query-client';

import Pagination from './pagination';
import Product from './product-list-item';
import Filters from './filters';
import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';

function ProductList() {
  const { getCurrentPage, getCurrentQuery, getCurrentCategory, setPage } =
    useAppSearchParams();

  const query = getCurrentQuery();
  const currentPage = getCurrentPage();
  const category = getCurrentCategory();

  const { isPending, isError, data, isPlaceholderData } = useQuery({
    ...productListApi.getPaginatedProductListQueryOptions({
      page: currentPage,
      category,
      query,
    }),
    placeholderData: keepPreviousData,
  });

  const handleChangePage = ({ page }: { page: number }) => {
    const { total, limit } = data || {
      total: 0,
      limit: 0,
    };
    const isPrefetchAllowed = total > (page + 1) * limit;

    if (!isPlaceholderData && page > currentPage && isPrefetchAllowed) {
      queryClient.prefetchQuery({
        ...productListApi.getPaginatedProductListQueryOptions({
          page: page + 1,
          category,
          query,
        }),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }

    setPage(page);
  };

  if (isPending)
    return (
      <div className="text-center text-gray-500 h-full flex items-center justify-center">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 h-full flex items-center justify-center">
        Error loading products.
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-12 relative">
      <div className="sticky top-8 flex-shrink-0 h-full">
        <Filters />
      </div>

      <div className="flex flex-col items-center gap-8 grow">
        <div className="w-full flex flex-col gap-4 flex-grow">
          {data.products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>

        {data.products.length === 0 && (
          <div className="text-center text-gray-500 h-full flex items-center justify-center">
            No products found for this category.
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={data.total}
          onHandleChangePage={handleChangePage}
        />
      </div>
    </div>
  );
}

export default ProductList;

// const useIntersectionObserver = (onIntersect: () => void) => {
//   const unsubscribe = useRef(() => {});

//   return useCallback((el: HTMLElement | null) => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           onIntersect();
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (el) {
//       observer.observe(el);
//       unsubscribe.current = () => observer.disconnect();
//     } else {
//       unsubscribe.current();
//     }
//   }, []);
// };
