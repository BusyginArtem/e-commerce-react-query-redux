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

export const getCategoryIcon = (category: string) => {
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
