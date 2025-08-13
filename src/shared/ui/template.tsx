import { Link, Outlet, useLocation } from 'react-router';
import { Suspense } from 'react';

import { cn } from '../utils/style-helpers';
import { ShoppingBag, Package, ShoppingCart, LogIn } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useUserData } from '../hooks/useUserData';
import { Button } from './button';
import { useAppDispatch } from '@/app/store';
import { logoutThunk } from '@/modules/auth/thunks/logout';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useCartData } from '@/modules/cart/hooks/useCart-rtk';

function Template() {
  const { pathname } = useLocation();

  const { user } = useUserData();
  const { itemCount } = useCartData();

  const dispatch = useAppDispatch();

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
      badge: itemCount,
    },
  ];

  const handleSignOut = () => {
    dispatch(logoutThunk({ userId: user?.id }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <header className="border-b border-gray-200 shadow-sm sticky top-0 z-1 backdrop-blur-xs bg-white/80">
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
            <nav className="flex items-center space-x-2">
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

                    {!!item.badge && (
                      <span
                        className={cn(
                          'absolute -top-2 -right-1 h-5 w-5 rounded-full text-xs font-bold flex items-center justify-center',
                          {
                            'bg-white text-blue-600': item.isActive,
                            'bg-blue-600 text-white': !item.isActive,
                          }
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Authentication Section */}
              {user?.id ? (
                <>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="ml-4 cursor-pointer"
                  >
                    Sign Out
                  </Button>

                  <div className="ml-4 w-8 h-8">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.image}
                            alt={user?.username}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-400">
                            {user?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>

                      <PopoverContent>
                        <p className="font-medium">{user?.username}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
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
