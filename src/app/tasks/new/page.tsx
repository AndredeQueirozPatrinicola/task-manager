import Link from "next/link";
import { TaskForm } from "@/components/tasks/task-form";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function NewTaskPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to tasks
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">New task</h1>
        <p className="mt-1 text-sm text-gray-500">Give it a short title and, if you want, a few details.</p>
      </div>
      <TaskForm />
    </main>
  );
}
