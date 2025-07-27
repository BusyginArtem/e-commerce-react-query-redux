import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';

import { productListApi } from '@/modules/products/api';

import Reviews from './reviews';

function Product() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : 1;

  const {
    isPending,
    isError,
    data: product,
  } = useQuery({
    ...productListApi.getProductByIdQueryOptions({
      page: currentPage,
      id: Number(id),
    }),
  });

  if (isPending && !product)
    return <p className="text-center py-6">Loading product...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load product details.
      </p>
    );

  if (!product) return <p className="text-center py-6">Product not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {/* Main Thumbnail */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-64 h-64 object-cover rounded-lg mb-6"
      />

      {/* Basic Info */}
      <div className="space-y-2 mb-6">
        <p className="text-lg">
          <span className="font-semibold">Price:</span> ${product.price}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {product.category}
        </p>
        <p>
          <span className="font-semibold">Brand:</span> {product.brand ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Stock:</span> {product.stock}
        </p>
        <p>
          <span className="font-semibold">Rating:</span> {product.rating}/5
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6">{product.description}</p>

      {/* Image Gallery */}
      {product.images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Gallery</h3>
          <div className="flex flex-wrap gap-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title}-${i}`}
                className="w-24 h-24 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <Reviews reviews={product?.reviews} />
    </div>
  );
}

export default Product;
