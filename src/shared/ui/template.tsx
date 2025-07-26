import { Link, Outlet } from 'react-router';
import { cn } from '../utils/style-helpers';
import { Suspense } from 'react';

function Template() {
  return (
    <div className="min-h-screen flex flex-col p-4 font-inter container mx-auto">
      <header className="p-5 min-h-6 flex justify-between">
        <h1 className="text-2xl font-bold">My Store</h1>

        <nav className="flex justify-center space-x-4 pb-6">
          <Link to="/products" className={cn('nav-btn', {})}>
            Products
          </Link>

          <Link to="/cart" className={cn('nav-btn', {})}>
            Cart
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
