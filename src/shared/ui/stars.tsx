import { cn } from '@/shared/utils/style-helpers';
import { cva } from 'class-variance-authority';
import { Star } from 'lucide-react';

const starVariants = cva('text-gray-300', {
  variants: {
    size: {
      default: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function Stars({
  rating,
  size = 'default',
}: {
  rating: number;
  size?: 'default' | 'lg' | 'md';
}) {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={cn(starVariants({ size }), {
        'text-yellow-400 fill-current': index < Math.floor(rating),
      })}
    />
  ));
}

// eslint-disable-next-line react-refresh/only-export-components
export { Stars, starVariants };
