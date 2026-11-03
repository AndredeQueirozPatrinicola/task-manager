/*
    Task ZOD Schema Validation
*/
import { z } from "zod";

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

export {
    createTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
    taskByIdSchema
};
