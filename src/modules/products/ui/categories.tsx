import { useQuery } from '@tanstack/react-query';
import { productListApi } from '../api';
import { cn } from '@/shared/utils/style-helpers';
import { useAppSearchParams } from '@/shared/hooks/useAppSearchParams';
import {
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Car,
  Dumbbell,
  Sparkles,
  Watch,
  Sofa,
  Zap,
  Package,
  Tag,
} from 'lucide-react';

// Category icon mapping
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    smartphones: Smartphone,
    laptops: Laptop,
    fragrances: Sparkles,
    skincare: Sparkles,
    groceries: Package,
    'home-decoration': Home,
    furniture: Sofa,
    tops: Shirt,
    'womens-dresses': Shirt,
    'womens-shoes': Shirt,
    'mens-shirts': Shirt,
    'mens-shoes': Shirt,
    'mens-watches': Watch,
    'womens-watches': Watch,
    'womens-bags': Package,
    'womens-jewellery': Sparkles,
    sunglasses: Sparkles,
    automotive: Car,
    motorcycle: Car,
    lighting: Zap,
    'sports-accessories': Dumbbell,
    tablet: Laptop,
    mobile: Smartphone,
    kitchen: Home,
    beauty: Sparkles,
  };

  const normalizedCategory = category.toLowerCase().replace(/[\s-_]/g, '');

  // Try exact match first
  if (iconMap[category]) return iconMap[category];

  // Try normalized match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedCategory.includes(key.toLowerCase().replace(/[\s-_]/g, ''))) {
      return icon;
    }
  }

  // Default icon
  return Tag;
};

// Format category name for display
const formatCategoryName = (category: string) => {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Categories() {
  const { getCurrentCategory, setCategory } = useAppSearchParams();
  const currentCategory = getCurrentCategory();

  const { data: categories, isLoading } = useQuery({
    ...productListApi.getProductCategoriesQueryOptions(),
  });

  const handleSetCategory = (category: string) => {
    setCategory(category);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg animate-pulse"
          >
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {categories?.map((category) => {
        const Icon = getCategoryIcon(category);
        const isActive = category === currentCategory;

        return (
          <button
            key={category}
            onClick={() => handleSetCategory(category)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200',
              'hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              'border border-transparent hover:border-gray-200 cursor-pointer',
              isActive && [
                'bg-blue-50 border-blue-200 text-blue-700',
                'hover:bg-blue-100 hover:border-blue-300',
                'shadow-sm',
              ]
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            />
            <span
              className={cn(
                'text-left truncate',
                isActive ? 'text-blue-900' : 'text-gray-700'
              )}
            >
              {formatCategoryName(category)}
            </span>
            {isActive && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
