/*
    Task ZOD Schema Validation
*/
import { z } from "zod";

const TASKS_PAGE_SIZE = 10;

const TASK_SEARCH_MAX_LENGTH = 100;

const TASK_SORTS = ["newest", "oldest", "title_asc", "title_desc"] as const;

const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Title must have at least 3 characters"),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
    id: z.string().trim().uuid(),
    title: z.string().trim().min(3, "Title must have at least 3 characters"),
    description: z.string().optional()
})

const deleteTaskSchema = z.object({
    id: z.string().trim().uuid()
})

const taskByIdSchema = z.object({
    id: z.string().trim().uuid()
})

const listTasksSchema = z.object({
    limit: z.number().int().min(1).max(50).default(TASKS_PAGE_SIZE),
    cursor: z.object({
        id: z.string().uuid(),
        title: z.string(),
        createdAt: z.date(),
    }).nullish(),
    search: z.string().trim().max(TASK_SEARCH_MAX_LENGTH).optional(),
    sort: z.enum(TASK_SORTS).default("newest"),
})

export {
    TASKS_PAGE_SIZE,
    TASK_SEARCH_MAX_LENGTH,
    TASK_SORTS,
    createTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
    taskByIdSchema,
    listTasksSchema
};
