import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

// Browser-only helper. Import this from Client Components.
export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
});
