import { Button } from '@/shared/ui/button';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as ErrorBoundaryComponent } from 'react-error-boundary';

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundaryComponent
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        {children}
      </ErrorBoundaryComponent>
    )}
  </QueryErrorResetBoundary>
);
