import { TaskForm } from "@/components/tasks/task-form";

export default function NewTaskPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Create a task</h1>
      <TaskForm />
    </main>
  );
}
