import { createTRPCRouter, publicProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema } from "@/lib/validations/task";

import { TRPCError } from "@trpc/server";
import { TaskStore } from "../../store/task-store";

/*
  Task Router: 
  
    This file stores the implementation of the tasks endpoints.
*/

const taskStore = new TaskStore()

export const taskRouter = createTRPCRouter({
    list: publicProcedure.query(() => {
    return taskStore.list();
  }),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => {
      return taskStore.create({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...input
      });
    }),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => {
      const task = taskStore.update(input.id, input)
      if(!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        })
      }
      return task
    }),

  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(({ input }) => {
      const deleted = taskStore.delete(input.id);

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return { success: true };
    }),

});
