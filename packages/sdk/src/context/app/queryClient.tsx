import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import type { IHttpError } from '@teable/core';
import { toast } from '@teable/ui-lib';

export const errorRequestHandler = (error: unknown) => {
  const { code, message, status } = error as IHttpError;
  // no authentication
  if (status === 401) {
    window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.href)}`;
    return;
  }
  toast({
    variant: 'destructive',
    title: code || 'Unknown Error',
    description: message,
  });
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 10 * 1000,
        retry: false,
        networkMode: 'always',
      },
      mutations: {
        networkMode: 'always',
      },
    },
    queryCache: new QueryCache({
      onError: errorRequestHandler,
    }),
    mutationCache: new MutationCache({
      onError: errorRequestHandler,
    }),
  });
};
