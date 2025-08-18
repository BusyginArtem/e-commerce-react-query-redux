import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import type { SortBy, Order } from '@/modules/products/api/models';

function SortProducts() {
  const { setSortByAndOrder } = useAppSearchParams();

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split('-');

    setSortByAndOrder(sortBy as SortBy, order as Order);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="font-semibold">Sort by:</span>
      <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
          <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortProducts;
