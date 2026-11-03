import { describe, it, expect } from "vitest";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { appRouter } from "./root";

const callProcedure = (path: string, input: unknown) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req: new Request(`http://localhost/api/trpc/${path}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(superjson.serialize(input)),
        }),
        router: appRouter,
        createContext: () => ({}),
    });

const readError = async (response: Response) => {
    const body = await response.json();
    return superjson.deserialize<{
        message: string;
        data: { zodError: { fieldErrors: Record<string, string[]> } | null };
    }>(body.error);
};

describe("transformer", () => {
    it("should keep createdAt as a Date over HTTP", async () => {
        const response = await callProcedure("tasks.create", { title: "Superjson Task" });
        const body = await response.json();
        const task = superjson.deserialize<{ createdAt: Date }>(body.result.data);

        expect(task.createdAt).toBeInstanceOf(Date);
    });
});

describe("errorFormatter", () => {
    it("should return readable validation messages", async () => {
        const response = await callProcedure("tasks.create", { title: "" });
        const error = await readError(response);

        expect(response.status).toBe(400);
        expect(error.message).toBe("Title must have at least 3 characters");
        expect(error.data.zodError?.fieldErrors.title).toEqual([
            "Title must have at least 3 characters",
        ]);
    });

    it("should keep the original message for non validation errors", async () => {
        const response = await callProcedure("tasks.delete", { id: crypto.randomUUID() });
        const error = await readError(response);

        expect(response.status).toBe(404);
        expect(error.message).toBe("Task not found");
        expect(error.data.zodError).toBeNull();
    });
});
