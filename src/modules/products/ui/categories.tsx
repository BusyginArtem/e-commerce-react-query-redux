import { useQuery } from '@tanstack/react-query';
import { productListApi } from '../api';
import { useSearchParams } from 'react-router';

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories } = useQuery({
    ...productListApi.getProductCategoriesQueryOptions(),
  });

  const handleSetCategory = (category: string) => {
    setSearchParams(
      {
        category,
        page: '1',
        ...Object.fromEntries(searchParams.entries()),
      },
      {
        replace: true,
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories?.map((category) => (
        <span
          key={category}
          onClick={() => handleSetCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition hover:bg-gray-100 cursor-pointer `}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
