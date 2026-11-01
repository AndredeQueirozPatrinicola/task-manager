/*
    I created this file to store the data-structures to save in-memory tasks.
*/
import { Task } from "@/types/task";

export {
    TaskStore
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

    findById(id: string): Task | undefined{
        return this.tasks.get(id);
    }

    create(task: Task): Task{
        this.tasks.set(task.id, task)
        return task;
    }

    update(taskId: string, task: Task): Task | undefined{
        const taskQuery = this.tasks.get(taskId);

        if (!task) return undefined;

        const updatedTask = {
            ...taskQuery,
            ...task,
        };

        this.tasks.set(taskId, updatedTask);
        return task;
    }
    
    delete(taskId: string){
        return this.tasks.delete(taskId)
    }
}