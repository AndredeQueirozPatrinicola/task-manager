/*
    This files stores the data types used along both client side and server side. 
    It's better to keep it on it's on file then sparing types all along the application.
*/

type Task = {
    id: string;
    title: string;
    description: string;
    createdAt: Date
}

export type {
    Task
};
