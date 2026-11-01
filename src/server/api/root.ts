import { createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/tasks";

export const appRouter = createTRPCRouter({
  tasks: taskRouter,
});

export type AppRouter = typeof appRouter;
