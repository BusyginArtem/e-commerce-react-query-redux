import { Trash2, Minus, Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/shared/ui/card';

import type { CartProductDto } from '@/modules/cart/api/models';
import { useAppDispatch } from '@/app/store';
import { cartSlice } from '@/modules/cart/features/cart.slice';

type Props = {
  item: CartProductDto;
};

function CartItem({ item }: Props) {
  const dispatch = useAppDispatch();

  const itemDiscount = item.discountedTotal
    ? item.total - item.discountedTotal
    : 0;
  const hasItemDiscount = itemDiscount > 0 && item?.discountedTotal;

  return (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-grow">
            <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
            {hasItemDiscount && (
              <div className="inline-flex items-center gap-1 mb-2">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {item.discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                dispatch(
                  cartSlice.actions.removeProductFromCart({
                    productId: item.id,
                  })
                )
              }
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasItemDiscount ? (
              <>
                <div className="text-lg line-through text-gray-400">
                  ${item.price.toFixed(2)}
                </div>
                <div className="text-xl font-bold text-gray-800">
                  $
                  {(item.price * (1 - item.discountPercentage / 100)).toFixed(
                    2
                  )}
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-800">
                ${item.price.toFixed(2)}
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                dispatch(
                  cartSlice.actions.updateProductQuantity({
                    productId: item.id,
                    quantity: item.quantity - 1,
                  })
                )
              }
              disabled={item.quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-12 text-center font-medium">
              {item.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                dispatch(
                  cartSlice.actions.updateProductQuantity({
                    productId: item.id,
                    quantity: item.quantity + 1,
                  })
                )
              }
              className="h-8 w-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-col items-end">
            {hasItemDiscount ? (
              <>
                <div className="text-sm line-through text-gray-400">
                  ${item.total.toFixed(2)}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ${item.discountedTotal?.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-lg font-bold text-blue-600">
                ${item.total.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
