import { useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';

import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import Categories from './categories';
import { useState } from 'react';
import { cn } from '@/shared/utils/style-helpers';
import { Button } from '@/shared/ui/button';

function Filters() {
  const {
    getCurrentQuery,
    setEmptyCategory,
    setSearchQuery,
    getCurrentCategory,
  } = useAppSearchParams();
  const query = getCurrentQuery();
  const category = getCurrentCategory();

  const [searchValue, setSearchValue] = useState(query || '');

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();
    setSearchValue(query);

    if (intervalId.current) {
      clearTimeout(intervalId.current);
    }

    intervalId.current = setTimeout(() => {
      setSearchQuery(query);
      intervalId.current = null;
    }, 300);
  };

  const handleSetEmptyCategory = () => {
    setEmptyCategory();
    setSearchValue('');
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Filter className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            handleSetEmptyCategory();
            clearSearch();
          }}
          className="text-blue-600 hover:text-blue-700 ml-auto cursor-pointer"
        >
          Clear all filters
        </Button>
      </div>

      {/* Search Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Search Products
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className={cn(
              'w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
              'placeholder:text-gray-400 text-gray-900 font-medium',
              'transition-all duration-200 hover:border-gray-300',
              'bg-white shadow-sm'
            )}
            placeholder="Search for products..."
            onChange={handleSearchChange}
            value={searchValue}
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {searchValue && (
          <p className="text-xs text-blue-600 font-medium">
            Searching for "{searchValue}"
          </p>
        )}
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-800">
          Categories
        </label>

        <div className="space-y-3">
          {/* All Categories Button */}
          <button
            onClick={handleSetEmptyCategory}
            className={cn(
              'w-full px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'hover:shadow-md active:scale-[0.98] cursor-pointer',
              !query && !category
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            )}
          >
            <div className="flex items-center justify-between ">
              <span>All Products</span>
              <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
            </div>
          </button>

          {/* Category Pills */}
          <div className="space-y-2">
            <Categories />
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="pt-6 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {searchValue && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                Search: {searchValue}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs capitalize">
                {category}
              </span>
            )}
            {!searchValue && !category && (
              <span className="text-gray-400 italic">None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
