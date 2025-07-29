import { Package, Grid, List } from 'lucide-react';
import { useState } from 'react';

import ProductList from '../../modules/products/ui/product-list-view';
import ProductGridView from '../../modules/products/ui/product-grid-view';
import { Button } from '@/shared/ui/button';

function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Title and Description */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Our Products
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed to meet
            your needs
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>

          {/* Additional Controls (future use) */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Product List */}
      <div className="min-h-screen">
        {viewMode === 'list' ? <ProductList /> : <ProductGridView />}
      </div>

      {/* Bottom Section - Features/Info */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              All products are carefully selected and quality-tested before
              reaching you
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick and reliable shipping to get your products to you as soon as
              possible
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">
              Customer Satisfaction
            </h3>
            <p className="text-sm text-gray-600">
              Your satisfaction is our priority with easy returns and excellent
              support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
