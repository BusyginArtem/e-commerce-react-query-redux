import { useSearchParams } from 'react-router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productListApi } from '../api';
import { queryClient } from '@/shared/api/query-client';

import Pagination from './pagination';
import Product from './product-list-item';
import Filters from './filters';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : 1;

  const category = searchParams.get('category') || '';

  const { isPending, isError, data, isPlaceholderData } = useQuery({
    ...productListApi.getPaginatedProductListQueryOptions({
      page: currentPage,
      category,
    }),
    placeholderData: keepPreviousData,
  });

  const handleChangePage = ({ page }: { page: number }) => {
    if (!isPlaceholderData && page > currentPage) {
      queryClient.prefetchQuery({
        ...productListApi.getPaginatedProductListQueryOptions({
          page: page + 1,
          category,
        }),
        staleTime: 1000 * 60 * 10, // 10 minutes
      });
    }

    setSearchParams(
      { page: String(page), ...Object.fromEntries(searchParams.entries()) },
      {
        replace: true,
      }
    );
  };

  if (isPending) return 'Loading...';

  if (isError) return 'An error has occurred!';

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
