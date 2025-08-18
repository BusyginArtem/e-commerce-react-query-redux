import { createBrowserRouter, redirect } from 'react-router';

import Template from '../shared/ui/template';
import { queryClient } from '@/shared/api/query-client';
import { productsApi, type ProductIdentifier } from '@/modules/products/api';
import {
  getCurrentUserId,
  prefetchUserData,
} from '@/shared/utils/prefetch-utils';
import type { Order, SortBy } from '@/modules/products/api/models';

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
              const sortBy = url.searchParams.get('sortBy')
                ? (String(url.searchParams.get('sortBy')) as SortBy)
                : undefined;
              const order = url.searchParams.get('order')
                ? (String(url.searchParams.get('order')) as Order)
                : undefined;

              queryClient.prefetchQuery({
                ...productsApi.getPaginatedProductListQueryOptions({
                  page,
                  category,
                  query,
                  sortBy,
                  order,
                }),
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
                ...productsApi.getProductByIdQueryOptions({
                  id: Number(params.id) as ProductIdentifier,
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
              const userId = getCurrentUserId();

              if (!userId) {
                throw redirect('/sign-in');
              }
              console.log('/cart - prefetchUserData');
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
