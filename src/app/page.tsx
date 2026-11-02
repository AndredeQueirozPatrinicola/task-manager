import Link from "next/link";
import { serverCaller } from "@/lib/trpc/server";
import { TaskList } from "@/components/tasks/task-list";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tasks = await serverCaller.tasks.list();

  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-sm text-gray-500">Organize your work, one task at a time.</p>
        </div>
        <Link
          href="/tasks/new"
          className="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-700"
        >
          New task
        </Link>
      </header>

      <TaskList tasks={tasks} />
    </main>
  );
}
