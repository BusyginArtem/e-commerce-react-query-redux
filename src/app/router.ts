import { createBrowserRouter } from 'react-router';
// import { store } from "./store";

import Template from '../shared/ui/template';

const loadStore = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(1), 0);
  });

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Template,
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
            loader: () =>
              loadStore().then(() => {
                return null;
              }),
          };
        },
      },
    ],
  },
]);
