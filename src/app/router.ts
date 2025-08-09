import { createBrowserRouter, redirect } from 'react-router';

import Template from '../shared/ui/template';
import { queryClient } from '@/shared/api/query-client';
import { productListApi } from '@/modules/products/api';
import {
  getCurrentUserId,
  prefetchUserData,
} from '@/shared/utils/prefetch-utils';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Template,
    loader: async () => {
      await prefetchUserData();

      return null;
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import('../pages/home');
          return {
            Component: module.default,
          };
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const module = await import('../pages/products');
          return {
            Component: module.default,
            loader: ({ request }) => {
              const url = new URL(request.url);
              const page = url.searchParams.get('page')
                ? Number(url.searchParams.get('page'))
                : 1;
              const category = url.searchParams.get('category')
                ? String(url.searchParams.get('category'))
                : '';
              const query = url.searchParams.get('query')
                ? String(url.searchParams.get('query'))
                : '';

              queryClient.prefetchQuery({
                ...productListApi.getPaginatedProductListQueryOptions({
                  page,
                  category,
                  query,
                }),
              });

              queryClient.prefetchQuery({
                ...productListApi.getProductCategoriesQueryOptions(),
              });

              return null;
            },
          };
        },
      },
      {
        path: 'products/:id',
        lazy: async () => {
          const module = await import('../pages/product');
          return {
            Component: module.default,
            loader: ({ params, request }) => {
              const url = new URL(request.url);
              const page = Number(url.searchParams.get('page')) || 1;

              queryClient.prefetchQuery({
                ...productListApi.getProductByIdQueryOptions({
                  id: Number(params.id),
                  page,
                }),
              });

              return null;
            },
          };
        },
      },
      {
        path: 'cart',
        lazy: async () => {
          const module = await import('../pages/cart');
          return {
            Component: module.default,
            loader: async () => {
              // Check if user is authenticated
              const userId = getCurrentUserId();

              if (!userId) {
                // Redirect to sign-in if not authenticated
                throw redirect('/sign-in');
              }

              // Prefetch both user and cart data
              await prefetchUserData();

              return null;
            },
          };
        },
      },
    ],
  },
  {
    path: 'sign-in',
    lazy: async () => {
      const module = await import('../pages/sign-in');
      return {
        Component: module.default,
      };
    },
  },
  {
    path: '*',
    lazy: async () => {
      const module = await import('../pages/not-found');
      return {
        Component: module.default,
      };
    },
  },
]);
