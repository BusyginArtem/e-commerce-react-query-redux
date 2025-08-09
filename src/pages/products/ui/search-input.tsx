import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/shared/utils/style-helpers';

type Props = {
  label: string;
  initValue?: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

function SearchInput({
  label,
  initValue,
  onSearchChange,
  onClearSearch,
}: Props) {
  const [searchValue, setSearchValue] = useState(initValue || '');

  useEffect(() => {
    if (!initValue) {
      setSearchValue('');
    }
  }, [initValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.trim();

    setSearchValue(query);
    onSearchChange(query);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        {label}
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
            onClick={onClearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
