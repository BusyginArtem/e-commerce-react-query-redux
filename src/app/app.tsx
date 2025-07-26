import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { router } from './router';
import { queryClient } from '../shared/api/query-client';
// import { ErrorBoundary } from './error-boundary';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ErrorBoundary> */}
      <RouterProvider router={router} />
      {/* </ErrorBoundary> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
