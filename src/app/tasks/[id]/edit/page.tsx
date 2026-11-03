import Link from "next/link";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { serverCaller } from "@/lib/trpc/server";
import { TaskForm } from "@/components/tasks/task-form";
import { ArrowLeftIcon } from "@/components/ui/icons";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

async function getTask(id: string) {
  try {
    return await serverCaller.tasks.byId({ id });
  } catch (error) {
    if (
      error instanceof TRPCError &&
      (error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")
    ) {
      return null;
    }
    throw error;
  }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

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
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit task</h1>
        <p className="mt-1 text-sm text-gray-500">Update the title or the details of this task.</p>
      </div>
      <TaskForm task={task} />
    </main>
  );
}
