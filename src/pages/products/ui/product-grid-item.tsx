import { useNavigate } from 'react-router';
import { ShoppingCart, Heart } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Stars } from '@/shared/ui/stars';

import type { ProductDto } from '@/modules/products/api';

function ProductGridItem({ product }: { product: ProductDto }) {
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

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.125 relative overflow-hidden">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm hover:bg-white h-8 w-8"
      >
        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
      </Button>

      {/* Product Image */}
      <div className="relative overflow-hidden" onClick={handleClick}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2" onClick={handleClick}>
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">
            {product.title}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3" onClick={handleClick}>
        {/* Category */}
        <div className="text-xs text-blue-600 font-medium capitalize">
          {product.category}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            <Stars rating={product.rating} />
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold text-gray-900">
              ${product.price}
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductGridItem;
