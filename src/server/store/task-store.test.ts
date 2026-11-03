import { describe, it, expect, beforeEach } from "vitest";
import { TaskStore } from "./task-store";

describe("TaskStore", () => {
    let store: TaskStore;

    beforeEach(() => {
        store = new TaskStore();
    });

    it("should start with an empty task list", () => {
        expect(store.list()).toEqual([]);
    });

    it("should create and retrieve a task", () => {
        const task = {
        id: crypto.randomUUID(),
        title: "Test Task",
        createdAt: new Date(),
        };

        store.create(task);

        expect(store.findById(task.id)).toEqual(task);
    });

    it("should return undefined for a missing task", () => {
        expect(store.findById("unknown-id")).toBeUndefined();
    });

    it("should list all created tasks", () => {
        const task = {
            id: crypto.randomUUID(),
            title: "Test Task",
            createdAt: new Date(),
        };

        store.create(task);

        expect(store.list()).toContain(task)
    })

    it("should update existing task", () => {
        const taskId = crypto.randomUUID()
        const task = {
            id: taskId,
            title: "Test Task",
            createdAt: new Date(),
        };
        
        store.create(task)

        const updatedTask = {
            ...task,
            title: "Another title"
        }

        store.update(taskId, updatedTask)

        expect(store.findById(taskId)).toEqual(updatedTask)
    })

    it("should return the merged task on update", () => {
        const task = {
            id: crypto.randomUUID(),
            title: "Test Task",
            description: "Original description",
            createdAt: new Date(),
        };

        store.create(task)

        const result = store.update(task.id, { title: "Another title" })

        expect(result).toEqual({ ...task, title: "Another title" })
    })

    it("should not change id or createdAt on update", () => {
        const task = {
            id: crypto.randomUUID(),
            title: "Test Task",
            createdAt: new Date("2024-01-01"),
        };

        const changes = {
            id: "other-id",
            title: "Another title",
            createdAt: new Date(),
        }

        store.create(task)
        store.update(task.id, changes)

        expect(store.findById(task.id)).toEqual({ ...task, title: "Another title" })
    })

    it("should return undefined to update missing task", () => {
        const task = {
            id: crypto.randomUUID(),
            title: "Test Task",
            createdAt: new Date(),
        };
        expect(store.update("task", task)).toBeUndefined()
    })

    it("should delete existing task", () => {
        const taskId = crypto.randomUUID()
        const task = {
            id: taskId,
            title: "Test Task",
            createdAt: new Date(),
        };
        
        store.create(task)
        store.delete(taskId)

        expect(store.list()).toEqual([])
    })

    it("should return false deleting not existing task", () => {
        expect(store.delete("non-existing-task")).toEqual(false)
    })

    describe("paginate", () => {
        const createTasks = (count: number) =>
            Array.from({ length: count }, (_, index) =>
                store.create({
                    id: crypto.randomUUID(),
                    title: `Task ${index + 1}`,
                    createdAt: new Date(2024, 0, index + 1),
                })
            );

        it("should return the newest tasks first", () => {
            const tasks = createTasks(3);

            const page = store.paginate({ limit: 10 });

            expect(page.items).toEqual([...tasks].reverse());
            expect(page.nextCursor).toBeNull();
        });

        it("should respect the limit and return a cursor", () => {
            const tasks = createTasks(5);

            const page = store.paginate({ limit: 2 });

            expect(page.items).toEqual([tasks[4], tasks[3]]);
            expect(page.nextCursor).toEqual({
                id: tasks[3].id,
                createdAt: tasks[3].createdAt,
            });
        });

        it("should continue from the cursor", () => {
            const tasks = createTasks(5);

            const first = store.paginate({ limit: 2 });
            const second = store.paginate({ limit: 2, cursor: first.nextCursor });
            const third = store.paginate({ limit: 2, cursor: second.nextCursor });

            expect(second.items).toEqual([tasks[2], tasks[1]]);
            expect(third.items).toEqual([tasks[0]]);
            expect(third.nextCursor).toBeNull();
        });

        it("should not return a cursor when the last page is exactly full", () => {
            createTasks(4);

            const first = store.paginate({ limit: 2 });
            const second = store.paginate({ limit: 2, cursor: first.nextCursor });

            expect(second.items).toHaveLength(2);
            expect(second.nextCursor).toBeNull();
        });

        it("should keep working when the cursor task was deleted", () => {
            const tasks = createTasks(4);

            const first = store.paginate({ limit: 2 });
            store.delete(tasks[2].id);

            const second = store.paginate({ limit: 2, cursor: first.nextCursor });

            expect(second.items).toEqual([tasks[1], tasks[0]]);
        });

        it("should not skip or repeat tasks with the same createdAt", () => {
            const createdAt = new Date(2024, 0, 1);
            const tasks = Array.from({ length: 5 }, (_, index) =>
                store.create({
                    id: crypto.randomUUID(),
                    title: `Task ${index + 1}`,
                    createdAt,
                })
            );

            const first = store.paginate({ limit: 2 });
            const second = store.paginate({ limit: 2, cursor: first.nextCursor });
            const third = store.paginate({ limit: 2, cursor: second.nextCursor });

            const ids = [...first.items, ...second.items, ...third.items].map((task) => task.id);

            expect(new Set(ids).size).toBe(5);
            expect(ids.sort()).toEqual(tasks.map((task) => task.id).sort());
        });

        it("should return an empty page when there are no tasks", () => {
            expect(store.paginate({ limit: 10 })).toEqual({ items: [], nextCursor: null });
        });
    });
});
