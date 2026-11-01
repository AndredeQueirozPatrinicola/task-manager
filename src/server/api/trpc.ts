import { initTRPC } from "@trpc/server";

/*
    Basic TRPC Router/Procedure implementation
*/
const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
