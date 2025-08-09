import { useNavigate } from 'react-router';
import { Star, ShoppingCart, Heart, Package } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

import type { ProductDto } from '../api';
import { cn } from '@/shared/utils/style-helpers';

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={cn('h-4 w-4 text-gray-300', {
        'text-yellow-400 fill-current': index < Math.floor(rating),
      })}
    />
  ));
};

function ProductItem({ product }: { product: ProductDto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: `/products/${product.id}`,
      search: window.location.search,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Wishlist logic here
    console.log('Added to wishlist:', product.id);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-md relative overflow-hidden border-0 shadow-md bg-white"
    >
      {/* Action Buttons - Top Right */}
      <CardAction className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm border border-gray-200"
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </Button>
      </CardAction>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="w-full sm:w-48 h-48 overflow-hidden rounded-lg ">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              Only {product.stock} left
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Package className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex-1 min-w-0">
          <CardHeader className="pb-3">
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600 ml-1">
                  ({product.rating})
                </span>
              </div>
            </div>

            {/* Title */}
            <CardTitle className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {product.title}
            </CardTitle>

            {/* Description */}
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              {truncateText(product.description, 120)}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {/* Price & Stock Info */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.brand && (
                    <span className="text-sm text-gray-500">
                      by {product.brand}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span
                    className={`font-medium ${
                      product.stock > 10
                        ? 'text-green-600'
                        : product.stock > 0
                          ? 'text-orange-600'
                          : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </span>

                  {product.rating > 4.5 && (
                    <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="font-medium"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="sm:hidden mt-4 flex gap-2">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 font-medium"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export default ProductItem;
