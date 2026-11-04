import { describe, it, expect } from "vitest";
import { createTaskSchema, deleteTaskSchema, listTasksSchema, taskByIdSchema, updateTaskSchema } from "./task";

describe("createTaskSchema", () => {

    it("should reject an empty title", () => {
        const result = createTaskSchema.safeParse({
            title: "",
        });

        expect(result.success).toBe(false);
    });

    it("should trim the task title", () => {
        const result = createTaskSchema.safeParse({
            title: "  Test Task  ",
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.title).toBe("Test Task");
        }
    });

    it("should accept a valid task", () => {
        const result = createTaskSchema.safeParse({
            title: "Test Task",
            description: "Test Task Description"
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.title).toBe("Test Task");
        }
    })

    it("should accept a task without description", () => {
        const result = createTaskSchema.safeParse({
            title: "Test Task",
        });

        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data.title).toBe("Test Task");
        }
    })

    it("should reject a title containing only whitespace", () => {
        const result = createTaskSchema.safeParse({
            title: "                     ",
        });

        expect(result.success).toBe(false);
    })

    it("should reject a non-string title", () => {
        const result = createTaskSchema.safeParse({
            title: 123,
        });

        expect(result.success).toBe(false);
    })

});

describe("updateTaskSchema", () => {
    it("should accept an update with a valid ID and title", () => {
        const result = updateTaskSchema.safeParse({
            id: crypto.randomUUID(),
            title: "Another Test Task",
        });

        expect(result.success).toBe(true);
    });

    it("should reject an invalid UUID", () => {
        const result = updateTaskSchema.safeParse({
            id: "invalid-uuid",
            title: "Test Task",
        });

        expect(result.success).toBe(false);
    });

    it("should reject an update without editable fields", () => {
        const result = updateTaskSchema.safeParse({
            id: crypto.randomUUID(),
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty title when provided", () => {
        const result = updateTaskSchema.safeParse({
            id: crypto.randomUUID(),
            title: "",
        });

        expect(result.success).toBe(false);
    });

    it("should reject an update without an ID", () => {
        const result = updateTaskSchema.safeParse({
            title: "Test Task",
        });

        expect(result.success).toBe(false);
    });
});


describe("deleteTaskSchema", () => {
    it("should accept a valid UUID", () => {
        const result = deleteTaskSchema.safeParse({
            id: crypto.randomUUID(),
        });

        expect(result.success).toBe(true);
    });

    it("should reject an invalid UUID", () => {
        const result = deleteTaskSchema.safeParse({
            id: "invalid-uuid",
        });

        expect(result.success).toBe(false);
    });

    it("should reject a missing ID", () => {
        const result = deleteTaskSchema.safeParse({});

        expect(result.success).toBe(false);
    });

});

describe("taskByIdSchema", () => {
    it("should accept a valid UUID", () => {
        const result = taskByIdSchema.safeParse({
            id: crypto.randomUUID(),
        });

        expect(result.success).toBe(true);
    });

    it("should reject an invalid UUID", () => {
        const result = taskByIdSchema.safeParse({
            id: "invalid-uuid",
        });

        expect(result.success).toBe(false);
    });
});

describe("listTasksSchema", () => {
    it("should apply the default limit and sort", () => {
        const result = listTasksSchema.parse({});

        expect(result).toMatchObject({ limit: 10, sort: "newest" });
    });

    it("should trim the search term", () => {
        const result = listTasksSchema.parse({ search: "  report  " });

        expect(result.search).toBe("report");
    });

    it("should reject an unknown sort", () => {
        const result = listTasksSchema.safeParse({ sort: "random" });

        expect(result.success).toBe(false);
    });

    it("should reject a search longer than 100 characters", () => {
        const result = listTasksSchema.safeParse({ search: "a".repeat(101) });

        expect(result.success).toBe(false);
    });
});
