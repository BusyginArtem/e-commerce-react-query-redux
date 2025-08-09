import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';

import { router } from './router';
import { queryClient } from '../shared/api/query-client';
import { ErrorBoundary } from './error-boundary';

import { store } from './store';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
