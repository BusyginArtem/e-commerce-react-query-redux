import { Link, Outlet, useLocation } from 'react-router';
import { Suspense } from 'react';
import { cn } from '../utils/style-helpers';

function Template() {
  const { pathname } = useLocation();

  const activeLinkStyle =
    'text-blue-500 font-semibold border-b-2 border-blue-500';
  const inactiveLinkStyle = 'text-gray-700 hover:text-blue-500';

  return (
    <div className="min-h-screen flex flex-col p-4 font-inter container mx-auto">
      <header className="p-5 min-h-6 flex justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-500"
        >
          <h1 className="text-2xl font-bold">My Store</h1>
        </Link>

        <nav className="flex justify-center space-x-4 pb-6">
          <Link
            to="/products"
            className={cn(inactiveLinkStyle, {
              [activeLinkStyle]: pathname.startsWith('/products'),
            })}
          >
            Products
          </Link>

          <Link
            to="/cart"
            className={cn(inactiveLinkStyle, {
              [activeLinkStyle]: pathname.startsWith('/cart'),
            })}
          >
            Cart
          </Link>

          <Link
            to="/sign-in"
            className={cn(inactiveLinkStyle, {
              [activeLinkStyle]: pathname.startsWith('/sign-in'),
            })}
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex flex-col space-y-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default Template;
