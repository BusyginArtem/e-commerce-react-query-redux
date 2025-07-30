import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productListApi } from '../api';
import { queryClient } from '@/shared/api/query-client';

import Pagination from './pagination';
import ProductGridItem from './product-grid-item';
import Filters from './filters';
import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import { Loader2, AlertCircle, Package } from 'lucide-react';

function ProductGridView() {
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

  if (isPending) {
    return (
      <div className="flex flex-col lg:flex-col gap-8 min-h-[60vh] max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
              <p className="text-gray-600 mt-1">0 products found</p>
            </div>

            {/* Results indicator */}
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Page 1 of 1
            </div>
          </div>
        </div>
        {/* Filters Skeleton */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-8 w-24"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded-full w-full"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Loading */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 font-medium">
              Loading products...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we fetch the latest products
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <Filters />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-4">
              We couldn't load the products. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {category
                ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
                : 'All Products'}
              {query && (
                <span className="text-blue-600"> matching "{query}"</span>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              {data?.total || 0} products found
            </p>
          </div>

          {/* Results indicator */}
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Page {currentPage} of{' '}
            {Math.ceil((data?.total || 0) / (data?.limit || 10))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <Filters />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Products Grid */}
          <div
            className={`transition-opacity duration-200 ${isPlaceholderData ? 'opacity-60' : 'opacity-100'}`}
          >
            {data?.products && data.products.length > 0 ? (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.products.map((product) => (
                    <ProductGridItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {query || category
                    ? `We couldn't find any products matching your current filters. Try adjusting your search criteria.`
                    : `It looks like there are no products available at the moment.`}
                </p>
                {(query || category) && (
                  <button
                    onClick={() => {
                      window.location.href = '/products';
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data?.products && data.products.length > 0 && (
            <div className="flex justify-center pt-8 border-t border-gray-200">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={data.total}
                  onHandleChangePage={handleChangePage}
                />
              </div>
            </div>
          )}

          {/* Loading overlay for placeholder data */}
          {isPlaceholderData && (
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductGridView;
