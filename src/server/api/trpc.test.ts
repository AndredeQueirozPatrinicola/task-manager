import { describe, it, expect } from "vitest";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";

const callProcedure = (path: string, input: unknown) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req: new Request(`http://localhost/api/trpc/${path}`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(input),
        }),
        router: appRouter,
        createContext: () => ({}),
    });

describe("errorFormatter", () => {
    it("should return readable validation messages", async () => {
        const response = await callProcedure("tasks.create", { title: "" });
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error.message).toBe("Title must have at least 3 characters");
        expect(body.error.data.zodError.fieldErrors.title).toEqual([
            "Title must have at least 3 characters",
        ]);
    });

    it("should keep the original message for non validation errors", async () => {
        const response = await callProcedure("tasks.delete", { id: crypto.randomUUID() });
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.error.message).toBe("Task not found");
        expect(body.error.data.zodError).toBeNull();
    });
});
