import { Link } from 'react-router';
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  ArrowRight,
  Zap,
  Users,
  Award,
  TrendingUp,
  Heart,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';

function Home() {
  const featuredProducts = [
    {
      id: 1,
      title: 'Premium Headphones',
      price: 299,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.8,
      category: 'Electronics',
    },
    {
      id: 2,
      title: 'Smart Watch',
      price: 199,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.6,
      category: 'Wearables',
    },
    {
      id: 3,
      title: 'Wireless Speaker',
      price: 149,
      image:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      rating: 4.7,
      category: 'Audio',
    },
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', count: '500+ products' },
    { name: 'Fashion', icon: '👕', count: '800+ products' },
    { name: 'Home & Garden', icon: '🏠', count: '300+ products' },
    { name: 'Sports', icon: '⚽', count: '200+ products' },
    { name: 'Books', icon: '📚', count: '150+ products' },
    { name: 'Beauty', icon: '💄', count: '250+ products' },
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Products Sold', value: '100K+', icon: ShoppingBag },
    { label: 'Customer Rating', value: '4.9/5', icon: Star },
    { label: 'Years Experience', value: '10+', icon: Award },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-16 lg:py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="h-8 w-8 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-lg">
                Welcome to My Store
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products
              <span className="block text-yellow-400">at Great Prices</span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Shop from our curated collection of premium products with fast
              delivery and excellent customer service
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="py-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Featured Products */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of trending products loved by
            thousands of customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg">{product.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </div>
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-8">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 rounded-2xl p-8 lg:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our diverse range of product categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name.toLowerCase()}`}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="py-8">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose My Store?
          </h2>
          <p className="text-lg text-gray-600">
            We're committed to providing you with the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl mb-4">
                Fast & Free Delivery
              </CardTitle>
              <CardDescription className="text-gray-600">
                Free shipping on all orders over $50. Fast delivery within 2-3
                business days nationwide.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl mb-4">Secure Shopping</CardTitle>
              <CardDescription className="text-gray-600">
                Your personal information is protected with industry-standard
                security measures and encryption.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl mb-4">Best Prices</CardTitle>
              <CardDescription className="text-gray-600">
                Competitive pricing with regular discounts and special offers
                for our valued customers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to Start Shopping?
        </h2>
        <p className="text-lg lg:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of satisfied customers and discover amazing products at
          unbeatable prices
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-8 py-4"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
          </Link>
          <Link to="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4"
            >
              Sign Up Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
