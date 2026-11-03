import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

/*
    Basic TRPC Router/Procedure implementation
*/
const t = initTRPC.create({
    errorFormatter({ shape, error }) {
        const zodError = error.cause instanceof ZodError ? error.cause : null;

        return {
            ...shape,
            message: zodError
                ? zodError.issues.map((issue) => issue.message).join(", ")
                : shape.message,
            data: {
                ...shape.data,
                zodError: zodError ? zodError.flatten() : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
