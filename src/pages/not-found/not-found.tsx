import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Home,
  Search,
  Package,
  AlertTriangle,
  ShoppingCart,
  LogIn,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/card';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularPages = [
    {
      to: '/products',
      label: 'Browse Products',
      icon: Package,
      description: 'Discover our full product catalog',
    },
    {
      to: '/cart',
      label: 'Shopping Cart',
      icon: ShoppingCart,
      description: 'View your cart items',
    },
    {
      to: '/sign-in',
      label: 'Sign In',
      icon: LogIn,
      description: 'Access your account',
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error Icon and Code */}
        <div className="space-y-4">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl sm:text-9xl font-bold text-gray-200 select-none">
              404
            </div>

            {/* Warning Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 bg-orange-100 rounded-full">
                <AlertTriangle className="h-12 w-12 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {popularPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link key={page.to} to={page.to} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="text-center pb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                      </div>
                      <CardTitle className="text-lg">{page.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <CardDescription className="text-sm">
                        {page.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Search className="h-4 w-4" />
            <span>
              Try searching for products or{' '}
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                browse our catalog
              </Link>
            </span>
          </div>
        </div>

        {/* Help Text */}
        <div className="pt-4 text-xs text-gray-400">
          If you believe this is an error, please contact our support team.
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
