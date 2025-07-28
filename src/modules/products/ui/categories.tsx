import { useQuery } from '@tanstack/react-query';
import { productListApi } from '../api';

import { cn } from '@/shared/utils/style-helpers';
import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';

export default function Categories() {
  const { getCurrentCategory, setCategory } = useAppSearchParams();

  const currentCategory = getCurrentCategory();

  const { data: categories } = useQuery({
    ...productListApi.getProductCategoriesQueryOptions(),
  });

  const handleSetCategory = (category: string) => {
    setCategory(category);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories?.map((category) => (
        <span
          key={category}
          onClick={() => handleSetCategory(category)}
          className={cn(
            `px-4 py-2 rounded-full text-sm font-medium border transition hover:bg-gray-100 cursor-pointer`,
            {
              'bg-blue-300 text-white border-blue-300 hover:bg-blue-400':
                category === currentCategory,
            }
          )}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
