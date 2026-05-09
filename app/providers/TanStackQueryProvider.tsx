"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/src/lib/api-client";

// ── Global error handler for queries ───────────────────────────────
// Handles errors that are NOT handled by individual query consumers.
function handleQueryError(error: Error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return;
      case "FORBIDDEN":
        toast.error("Access Denied", {
          description: "You are not authorized to view this resource.",
        });
        return;
      case "INTERNAL_ERROR":
        toast.error("Server Error", {
          description:
            "An unexpected server error occurred. Please try again later.",
        });
        return;
      case "NETWORK_ERROR":
        toast.error("Connection Error", {
          description:
            "Unable to reach the server. Please check your internet connection.",
        });
        return;
      case "PARSE_ERROR":
        toast.error("Server Error", {
          description: "Received an unexpected response from the server.",
        });
        return;
      default:
        // For NOT_FOUND and domain-specific errors, let components handle
        // via the query's `error` state — no global toast needed.
        break;
    }
  } else {
    toast.error("Unexpected Error", {
      description: "Something went wrong. Please try again.",
    });
  }
}

function shouldSkipUnauthorizedRedirect() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.pathname.startsWith("/auth/");
}

export function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => handleQueryError(error),
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // Global mutation handler: only handle 401 (redirect to login).
            // Domain-specific errors are handled by individual mutation
            // onError callbacks.
            if (
              error instanceof ApiError &&
              error.code === "UNAUTHORIZED" &&
              !shouldSkipUnauthorizedRedirect()
            ) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
              window.location.href = "/auth/login";
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
