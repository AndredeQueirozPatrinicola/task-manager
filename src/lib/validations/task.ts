/*
    Task ZOD Schema Validation
*/
import { z } from "zod";

const TASKS_PAGE_SIZE = 10;

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
        createdAt: z.date(),
    }).nullish(),
})

export {
    TASKS_PAGE_SIZE,
    createTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
    taskByIdSchema,
    listTasksSchema
};
