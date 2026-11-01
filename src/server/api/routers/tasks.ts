import { createTRPCRouter, publicProcedure } from "../trpc";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema } from "@/lib/validations/task";

import { Task } from "@/types/task";
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
    }),

  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(({ input }) => {
      return taskStore.delete(input.id)
    }),

});
