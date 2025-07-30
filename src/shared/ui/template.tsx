import { Link, Outlet, useLocation } from 'react-router';
import { Suspense, useState } from 'react';

import { cn } from '../utils/style-helpers';
import { ShoppingBag, Package, ShoppingCart, LogIn } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

function Template() {
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to false to see sign-in state

  const navItems = [
    {
      to: '/products',
      label: 'Products',
      icon: Package,
      isActive: pathname.startsWith('/products'),
    },
    {
      to: '/cart',
      label: 'Cart',
      icon: ShoppingCart,
      isActive: pathname.startsWith('/cart'),
      badge: 3, // Cart item count
    },
  ];

  const handleSignOut = () => {
    setIsAuthenticated(false);
    // Add your sign out logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">My Store</h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors relative',
                      item.isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center',
                          item.isActive
                            ? 'bg-white text-blue-600'
                            : 'bg-blue-600 text-white'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="ml-4 w-8 h-8">
                  <Avatar onClick={handleSignOut}>
                    <AvatarImage
                      className="rounded-3xl w-8 h-8"
                      width={32}
                      height={32}
                      src="https://github.com/shadcn.png"
                      alt="User Avatar"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Link
                  to="/sign-in"
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ml-4',
                    pathname.startsWith('/sign-in')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default Template;
