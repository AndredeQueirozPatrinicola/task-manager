/*
    I created this file to store the data-structures to save in-memory tasks.
*/
import { PaginatedTasks, Task, TaskChanges, TaskCursor, TaskSort } from "@/types/task";

export {
    TaskStore
};

type PaginateOptions = {
    limit: number;
    cursor?: TaskCursor | null;
    search?: string;
    sort?: TaskSort;
};

type TaskComparator = (a: TaskCursor, b: TaskCursor) => number;

const byDate = (a: TaskCursor, b: TaskCursor) => a.createdAt.getTime() - b.createdAt.getTime();

const byTitle = (a: TaskCursor, b: TaskCursor) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" });

const byId = (a: TaskCursor, b: TaskCursor) => a.id.localeCompare(b.id);

const comparators: Record<TaskSort, TaskComparator> = {
    newest: (a, b) => byDate(b, a) || byId(b, a),
    oldest: (a, b) => byDate(a, b) || byId(a, b),
    title_asc: (a, b) => byTitle(a, b) || byId(a, b),
    title_desc: (a, b) => byTitle(b, a) || byId(b, a),
};

const normalize = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const matchesSearch = (task: Task, search: string) => {
    const term = normalize(search);
    return normalize(task.title).includes(term)
        || normalize(task.description ?? "").includes(term);
};

/*
    I choose to build this class to represent the In memory storage of tasks. In this way i can
    easyly instaciate this class and re-use it in all parts of my application server.
*/
class TaskStore {

    private readonly tasks = new Map<string, Task>();

    list(): Task[]{
        return [...this.tasks.values()];
    }

    paginate({ limit, cursor, search, sort = "newest" }: PaginateOptions): PaginatedTasks{
        const compare = comparators[sort];
        const filtered = search
            ? this.list().filter((task) => matchesSearch(task, search))
            : this.list();
        const sorted = filtered.sort(compare);
        const remaining = cursor
            ? sorted.filter((task) => compare(cursor, task) < 0)
            : sorted;

        const items = remaining.slice(0, limit);
        const lastItem = items.at(-1);
        const hasMore = remaining.length > limit;

        return {
            items,
            nextCursor: hasMore && lastItem
                ? { id: lastItem.id, title: lastItem.title, createdAt: lastItem.createdAt }
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