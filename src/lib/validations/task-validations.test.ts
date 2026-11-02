import { describe, it, expect } from "vitest";
import { createTaskSchema, deleteTaskSchema, updateTaskSchema } from "./task";

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