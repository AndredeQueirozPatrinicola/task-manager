import type { TASK_SORTS } from "@/lib/validations/task";

/*
    This files stores the data types used along both client side and server side. 
    It's better to keep it on it's on file then sparing types all along the application.
*/

type Task = {
    id: string;
    title: string;
    description?: string;
    createdAt: Date
}

type TaskChanges = Partial<Pick<Task, "title" | "description">>;

type TaskCursor = Pick<Task, "id" | "title" | "createdAt">;

type TaskSort = (typeof TASK_SORTS)[number];

type PaginatedTasks = {
    items: Task[];
    nextCursor: TaskCursor | null;
};

export type {
    Task,
    TaskChanges,
    TaskCursor,
    TaskSort,
    PaginatedTasks
};
