import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

import type { ProductDto } from '../api';

function Product({ product }: { product: ProductDto }) {
  return (
    <Card className="border p-4 mb-2 rounded-sm">
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div>
          <span className="text-lg font-bold">${product.price}</span>
          <span className="text-sm text-gray-500">
            Category: {product.category}
          </span>
        </div>
        <img src={product.thumbnail} alt={product.title} className="mb-2" />
      </CardContent>
    </Card>
  );
}

export default Product;
