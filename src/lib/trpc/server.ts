import { appRouter } from "@/server/api/root";

// Runs procedures directly on the server, with no loopback HTTP request.
// When adding SSR for tasks, query through this caller.
export const serverCaller = appRouter.createCaller({});
