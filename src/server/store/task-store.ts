/*
    I created this file to store the data-structures to save in-memory tasks.
*/
import { Task } from "@/types/task";

export {
    TaskStore
};

class TaskStore {

    tasks = new Map<string, Task>();

    list(){}
    findById(){}
    create(){}
    update(){}
    delete(){}

}