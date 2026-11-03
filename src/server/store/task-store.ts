/*
    I created this file to store the data-structures to save in-memory tasks.
*/
import { PaginatedTasks, Task, TaskChanges, TaskCursor } from "@/types/task";

export {
    TaskStore
};

type PaginateOptions = {
    limit: number;
    cursor?: TaskCursor | null;
};

const compareNewestFirst = (a: TaskCursor, b: TaskCursor) =>
    b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id);

/*
    I choose to build this class to represent the In memory storage of tasks. In this way i can
    easyly instaciate this class and re-use it in all parts of my application server.
*/
class TaskStore {

    private readonly tasks = new Map<string, Task>();

    list(): Task[]{
        return [...this.tasks.values()];
    }

    paginate({ limit, cursor }: PaginateOptions): PaginatedTasks{
        const sorted = this.list().sort(compareNewestFirst);
        const remaining = cursor
            ? sorted.filter((task) => compareNewestFirst(cursor, task) < 0)
            : sorted;

        const items = remaining.slice(0, limit);
        const lastItem = items.at(-1);
        const hasMore = remaining.length > limit;

        return {
            items,
            nextCursor: hasMore && lastItem
                ? { id: lastItem.id, createdAt: lastItem.createdAt }
                : null,
        };
    }

    findById(id: string): Task | undefined{
        return this.tasks.get(id);
    }

    create(task: Task): Task{
        this.tasks.set(task.id, task)
        return task;
    }

    update(taskId: string, changes: TaskChanges): Task | undefined{
        const taskQuery = this.tasks.get(taskId);

        if (!taskQuery) return undefined;

        const updatedTask: Task = {
            ...taskQuery,
            ...changes,
            id: taskQuery.id,
            createdAt: taskQuery.createdAt,
        };

        this.tasks.set(taskId, updatedTask);
        return updatedTask;
    }

    delete(taskId: string){
        return this.tasks.delete(taskId)
    }
}