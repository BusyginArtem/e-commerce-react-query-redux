import { ShoppingCart } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import CartItem from './cart-item';

import { useCart } from '@/modules/cart/hooks/useCart';

function Cart() {
  const { cart, itemCount } = useCart();

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-xl text-gray-600 mb-2">
              Your cart is empty
            </CardTitle>
            <CardDescription className="text-gray-500 mb-6">
              Add some products to your cart to get started
            </CardDescription>
            <Button className="px-6 py-2">Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDiscount = cart.total - cart.discountedTotal;
  const hasDiscounts = totalDiscount > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        </div>
        <div className="text-sm text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.products.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({itemCount} items)
                </span>
                <span className="font-medium">${cart.total.toFixed(2)}</span>
              </div>

              {hasDiscounts && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -${totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    {hasDiscounts && (
                      <div className="text-sm line-through text-gray-400">
                        ${cart.total.toFixed(2)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-blue-600">
                      ${cart.discountedTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {hasDiscounts && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-green-800">
                    You're saving ${totalDiscount.toFixed(2)}!
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Cart;
