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
});