import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

export function isTRPCClientError(error: unknown): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}

export function getErrorMessage(error: unknown) {
  if (isTRPCClientError(error)) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
