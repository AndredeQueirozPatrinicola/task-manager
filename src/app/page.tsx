import Link from "next/link";
import { serverCaller } from "@/lib/trpc/server";
import { TaskList } from "@/components/tasks/task-list";
import { PlusIcon } from "@/components/ui/icons";
import { primaryButton } from "@/components/ui/styles";
import { TASKS_PAGE_SIZE } from "@/lib/validations/task";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialPage = await serverCaller.tasks.listPaginated({ limit: TASKS_PAGE_SIZE });

  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">Organize your work, one task at a time.</p>
        </div>
        <Link href="/tasks/new" className={primaryButton}>
          <PlusIcon />
          New task
        </Link>
      </header>

      <TaskList initialPage={initialPage} />
    </main>
  );
}
