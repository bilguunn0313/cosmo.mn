"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { enableMongolianZodErrors } from "@cosmo/shared";
import { ApiError } from "@/lib/api";

enableMongolianZodErrors();

const LOGIN_PATH = "/admin/login";
const PUBLIC_SITE_REVALIDATE_PATH = "/admin/revalidate";

function isUnauthorized(error: Error) {
  return error instanceof ApiError && error.status === 401;
}

function refreshPublicSite() {
  fetch(PUBLIC_SITE_REVALIDATE_PATH, { method: "POST" }).catch(() => undefined);
}

function shouldRetry(failureCount: number, error: Error) {
  const isClientError =
    error instanceof ApiError && error.status >= 400 && error.status < 500;

  return !isClientError && failureCount < 2;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [queryClient] = useState(() => {
    const handleError = (error: Error) => {
      const currentPath = window.location.pathname;

      if (!isUnauthorized(error) || currentPath === LOGIN_PATH) {
        return;
      }

      client.clear();
      router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(currentPath)}`);
    };

    const client = new QueryClient({
      queryCache: new QueryCache({ onError: handleError }),
      mutationCache: new MutationCache({
        onError: handleError,
        onSuccess: refreshPublicSite,
      }),
      defaultOptions: {
        queries: { staleTime: 60 * 1000, retry: shouldRetry },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
