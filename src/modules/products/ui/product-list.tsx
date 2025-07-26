import { useState } from 'react';
import {
  keepPreviousData,
  // useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import { productListApi } from '../api';
import { queryClient } from '@/shared/api/query-client';

import Pagination from './pagination';
import Product from './product';

function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, error, data, isPlaceholderData } = useQuery({
    ...productListApi.getPaginatedProductListQueryOptions({
      page: currentPage,
    }),
    placeholderData: keepPreviousData,
  });

  const handleChangePage = ({ page }: { page: number }) => {
    setCurrentPage(page);

    if (!isPlaceholderData && page > currentPage) {
      queryClient.prefetchQuery({
        ...productListApi.getPaginatedProductListQueryOptions({
          page: page + 1,
        }),
      });
    }
  };

  // const {
  //   isPending,
  //   error,
  //   data: products,
  //   // isPlaceholderData,
  //   fetchNextPage,
  //   // hasNextPage,
  //   // isFetchingNextPage,
  // } = useInfiniteQuery({
  //   ...productListApi.getTodoListInfinityQueryOptions(),
  //   placeholderData: keepPreviousData,
  // });

  // const cursorRef = useIntersectionObserver(() => {
  //   fetchNextPage();
  // });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {data.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={data.total}
        onHandleChangePage={handleChangePage}
      />
      {/* <div ref={cursorRef} /> */}
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
