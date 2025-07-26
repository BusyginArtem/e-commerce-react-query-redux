import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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

    if (!isPlaceholderData) {
      queryClient.prefetchQuery({
        ...productListApi.getPaginatedProductListQueryOptions({
          page,
        }),
      });
    }
  };

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="mb-4">
      {data.products.map((product) => (
        <Product key={product.id} product={product} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalItems={data.total}
        onHandleChangePage={handleChangePage}
      />
    </div>
  );
}

export default ProductList;
