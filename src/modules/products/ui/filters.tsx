import { useRef } from 'react';

import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import Categories from './categories';
import { useState } from 'react';

function Filters() {
  const { getCurrentQuery, setEmptyCategory, setSearchQuery } =
    useAppSearchParams();
  const query = getCurrentQuery();

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

  return (
    <div className="md:w-[20rem]">
      <h2 className="text-xl font-bold mb-8">Filters</h2>
      <div className="mb-12">
        {/* TODO  */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products..."
          onChange={handleSearchChange}
          value={searchValue}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Categories
        </label>
        <div className="flex flex-wrap gap-3">
          <span
            onClick={handleSetEmptyCategory}
            className="px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer hover:bg-gray-100"
          >
            All
          </span>

          <Categories />
        </div>
      </div>
    </div>
  );
}

export default Filters;
