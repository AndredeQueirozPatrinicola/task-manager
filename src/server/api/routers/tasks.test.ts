
import { describe, it, expect } from "vitest";
import { appRouter } from "@/server/api/root";
import type { PaginatedTasks, TaskCursor } from "@/types/task";

describe("Task Router", () => {
    const caller = appRouter.createCaller({});

    const createTask = (title = "Task Example") =>
        caller.tasks.create({ title });

    describe("tasks.create", () => {
        it("should create a task with valid input", async () => {
            const task = await createTask();

            expect(task).toMatchObject({
                title: "Task Example",
            });

            expect(task.id).toBeDefined();
            expect(task.createdAt).toBeDefined();
        });

        it("should generate a valid UUID", async () => {
            const task = await createTask();

            expect(task.id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                );
            });

        it("should create a task without description", async () => {
            const task = await createTask();

            expect(task.description).toBeUndefined();
        });

        it("should reject an empty title", async () => {
            await expect(
                caller.tasks.create({ title: "" })
            ).rejects.toMatchObject({
                code: "BAD_REQUEST",
            });
        });

        it("should reject a whitespace-only title", async () => {
        await expect(
            caller.tasks.create({ title: "   " })
        ).rejects.toMatchObject({
            code: "BAD_REQUEST",
        });
        });

        it("should trim the task title", async () => {
        const task = await createTask("  Task Example  ");

        expect(task.title).toBe("Task Example");
        });
    });

    describe("tasks.list", () => {
        it("should return an array of tasks", async () => {
        const tasks = await caller.tasks.list();

        expect(Array.isArray(tasks)).toBe(true);
        });

        it("should return created tasks", async () => {
        const created = await createTask("List Test");

        const tasks = await caller.tasks.list();

        expect(tasks).toContainEqual(created);
        });

        it("should return multiple created tasks", async () => {
        const first = await createTask("First Task");
        const second = await createTask("Second Task");

        const tasks = await caller.tasks.list();

        expect(tasks).toEqual(
            expect.arrayContaining([first, second])
        );
        });
    });

    describe("tasks.listPaginated", () => {
        it("should use a default limit of 10", async () => {
            await Promise.all(
                Array.from({ length: 11 }, (_, index) => createTask(`Paginated ${index}`))
            );

            const page = await caller.tasks.listPaginated({});

            expect(page.items).toHaveLength(10);
            expect(page.nextCursor).not.toBeNull();
        });

        it("should walk through every task without repeating", async () => {
            await createTask("Walk Task");

            const all = await caller.tasks.list();
            const ids: string[] = [];
            let cursor: TaskCursor | null = null;

            do {
                const page: PaginatedTasks = await caller.tasks.listPaginated({ limit: 3, cursor });
                ids.push(...page.items.map((task) => task.id));
                cursor = page.nextCursor;
            } while (cursor);

            expect(new Set(ids).size).toBe(ids.length);
            expect(ids).toHaveLength(all.length);
        });

        it("should reject a limit out of range", async () => {
            await expect(
                caller.tasks.listPaginated({ limit: 0 })
            ).rejects.toMatchObject({ code: "BAD_REQUEST" });

            await expect(
                caller.tasks.listPaginated({ limit: 51 })
            ).rejects.toMatchObject({ code: "BAD_REQUEST" });
        });

        it("should reject an invalid cursor", async () => {
            await expect(
                caller.tasks.listPaginated({
                    cursor: { id: "invalid-id", createdAt: new Date() },
                })
            ).rejects.toMatchObject({ code: "BAD_REQUEST" });
        });
    });

    describe("tasks.byId", () => {
        it("should return an existing task", async () => {
            const task = await createTask("By Id Task");

            const found = await caller.tasks.byId({ id: task.id });

            expect(found).toEqual(task);
        });

        it("should return NOT_FOUND for a missing task", async () => {
            await expect(
                caller.tasks.byId({ id: crypto.randomUUID() })
            ).rejects.toMatchObject({
                code: "NOT_FOUND",
            });
        });

        it("should reject an invalid UUID", async () => {
            await expect(
                caller.tasks.byId({ id: "invalid-id" })
            ).rejects.toMatchObject({
                code: "BAD_REQUEST",
            });
        });
    });

    describe("tasks.update", () => {
        it("should update an existing task", async () => {
            const task = await createTask();

            const updated = await caller.tasks.update({
                id: task.id,
                title: "Updated Task",
            });

            expect(updated).toMatchObject({
                id: task.id,
                title: "Updated Task",
            });
        });

        it("should keep createdAt when updating", async () => {
            const task = await createTask();

            const updated = await caller.tasks.update({
                id: task.id,
                title: "Updated Task",
            });

            expect(updated.createdAt).toEqual(task.createdAt);
        });

        it("should return NOT_FOUND for a missing task", async () => {
            await expect(
                caller.tasks.update({
                id: crypto.randomUUID(),
                title: "Updated Task",
                })
            ).rejects.toMatchObject({
                code: "NOT_FOUND",
            });
        });

        it("should reject an invalid UUID", async () => {
            await expect(
                caller.tasks.update({
                id: "invalid-id",
                title: "Updated Task",
                })
            ).rejects.toMatchObject({
                code: "BAD_REQUEST",
            });
        });

        it("should reject an empty title", async () => {
            const task = await createTask();

            await expect(
                caller.tasks.update({
                id: task.id,
                title: "",
                })
            ).rejects.toMatchObject({
                code: "BAD_REQUEST",
            });
        });
    });

    describe("tasks.delete", () => {
        it("should delete an existing task", async () => {
            const task = await createTask();

            const result = await caller.tasks.delete({
                id: task.id,
            });

            expect(result).toEqual({ success: true });

            const tasks = await caller.tasks.list();

            expect(tasks.find((item) => item.id === task.id))
                .toBeUndefined();
        });

        it("should return NOT_FOUND for a missing task", async () => {
            await expect(
                caller.tasks.delete({
                id: crypto.randomUUID(),
                })
            ).rejects.toMatchObject({
                code: "NOT_FOUND",
            });
        });

        it("should reject an invalid UUID", async () => {
            await expect(
                caller.tasks.delete({
                id: "invalid-id",
                })
            ).rejects.toMatchObject({
                code: "BAD_REQUEST",
            });
        });

        it("should not affect other tasks", async () => {
            const first = await createTask("First Task");
            const second = await createTask("Second Task");

            await caller.tasks.delete({ id: first.id });

            const tasks = await caller.tasks.list();

            expect(tasks.some((task) => task.id === first.id))
                .toBe(false);

            expect(tasks.some((task) => task.id === second.id))
                .toBe(true);
        });
    });
});
