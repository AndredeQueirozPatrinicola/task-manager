import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { serverCaller } from "@/lib/trpc/server";
import { TaskForm } from "@/components/tasks/task-form";

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
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit task</h1>
      <TaskForm task={task} />
    </main>
  );
}
