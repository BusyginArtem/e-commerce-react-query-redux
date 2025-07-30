import { createBrowserRouter } from 'react-router';
// import { store } from "./store";

import Template from '../shared/ui/template';
import { queryClient } from '@/shared/api/query-client';
import { productListApi } from '@/modules/products/api';

// const loadStore = () =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(1), 0);
//   });

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Template,
    loader: async () => {
      // await loadStore();
      // queryClient.prefetchQuery({
      //   ...productListApi.getProductCategoriesQueryOptions(),
      // });
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
              // loadStore().then(() => {
              //   return null;
              // }),

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
            // loader: ({ params, request }) => {
            // const url = new URL(request.url);
            // const page = Number(url.searchParams.get('page')) || 1;

            // queryClient.prefetchQuery({
            //   ...productListApi.getProductByIdQueryOptions({
            //     id: Number(params.id),
            //     page,
            //   }),
            // });
            // },
          };
        },
      },
      {
        path: 'sign-in',
        lazy: async () => {
          const module = await import('../pages/sign-in');
          return {
            Component: module.default,
            // loader: ({ params, request }) => {
            // const url = new URL(request.url);
            // const page = Number(url.searchParams.get('page')) || 1;

            // queryClient.prefetchQuery({
            //   ...productListApi.getProductByIdQueryOptions({
            //     id: Number(params.id),
            //     page,
            //   }),
            // });
            // },
          };
        },
      },
    ],
  },
]);
