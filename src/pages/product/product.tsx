import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  AlertCircle,
  Heart,
  Share2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Reviews from './reviews';
import { Stars } from '@/shared/ui/stars';

import { useProduct } from '@/modules/products/hooks/useProduct';

function Product() {
  const { id } = useParams();

  const { isPending, isError, product } = useProduct({ id: Number(id) });

  if (isPending && !product) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Back button skeleton */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-gray-800 mb-2">
              Failed to load product
            </CardTitle>
            <CardDescription className="text-gray-600 mb-6">
              We couldn't load the product details. Please try again.
            </CardDescription>
            <Button
              onClick={() => window.location.reload()}
              className="px-6 py-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-xl text-gray-800 mb-2">
              Product not found
            </CardTitle>
            <CardDescription className="text-gray-600">
              The product you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to={`/products${window.location.search}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </CardContent>
          </Card>

          {/* Image Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div key={i} className="flex-shrink-0">
                  <img
                    src={img}
                    alt={`${product.title}-${i}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  />
                </div>
              ))}
              {product.images.length > 4 && (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-500">
                  +{product.images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-4">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                <Stars rating={product.rating} />
              </div>
              <span className="text-sm text-gray-600">
                {product.rating}/5
                {product.reviews && (
                  <span className="ml-1">
                    ({product.reviews.length} reviews)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${product.price.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Price includes all taxes</p>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <p className="text-gray-600 capitalize">{product.category}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Brand:</span>
              <p className="text-gray-600">{product.brand ?? 'N/A'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Stock:</span>
              <p
                className={`font-medium ${
                  product.stock > 10
                    ? 'text-green-600'
                    : product.stock > 0
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} available`
                  : 'Out of stock'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Rating:</span>
              <p className="text-gray-600">{product.rating}/5 stars</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-6">
            <Button
              className="w-full py-3 text-lg"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <Button
              variant="outline"
              className="w-full py-3"
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-sm text-orange-600 font-medium text-center">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Reviews reviews={product?.reviews} />
      </div>
    </div>
  );
}

export default Product;
