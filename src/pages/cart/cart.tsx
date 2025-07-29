import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

// Mock cart item type - you can replace this with your actual cart item type
type CartItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail: string;
  category: string;
};

// Mock cart data - replace with your actual cart state/data
const mockCartItems: CartItem[] = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    quantity: 2,
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    category: 'smartphones',
  },
  {
    id: 2,
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211 6.5-inch Super Retina HD display',
    price: 899,
    quantity: 1,
    thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
    category: 'smartphones',
  },
  {
    id: 3,
    title: 'Samsung Universe 9',
    description:
      "Samsung's new variant which goes beyond Galaxy to the Universe",
    price: 1249,
    quantity: 1,
    thumbnail: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
    category: 'smartphones',
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        </div>
        <div className="text-sm text-gray-600">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
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
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </CardDescription>
                    <div className="text-sm text-gray-500 capitalize">
                      Category: {item.category}
                    </div>
                  </div>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-800">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-lg font-bold text-blue-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  Subtotal ({getTotalItems()} items)
                </span>
                <span className="font-medium">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ${(getTotalPrice() * 0.08).toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${(getTotalPrice() * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
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
