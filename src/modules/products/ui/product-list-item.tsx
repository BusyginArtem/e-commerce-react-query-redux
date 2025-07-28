import { useNavigate } from 'react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

import type { ProductDto } from '../api';

function ProductItem({ product }: { product: ProductDto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      pathname: `/products/${product.id}`,
      search: window.location.search,
    });
  };

  return (
    <Card
      onClick={handleClick}
      className="border p-6 mb-2 rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
    >
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-8">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="mb-2 max-w-[8rem] max-h-[8rem] object-cover"
          height={128}
          width={128}
        />

        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">${product.price}</span>
          <span className="text-md text-gray-500">
            Category: {product.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductItem;
