import Link from "next/link";
import { serverCaller } from "@/lib/trpc/server";
import { TasksView } from "@/components/tasks/tasks-view";
import { PlusIcon } from "@/components/ui/icons";
import { primaryButton } from "@/components/ui/styles";
import { TASKS_PAGE_SIZE, TASK_SEARCH_MAX_LENGTH, TASK_SORTS } from "@/lib/validations/task";
import type { TaskSort } from "@/types/task";

export const dynamic = "force-dynamic";

type SearchParamValue = string | string[] | undefined;

type HomePageProps = {
  searchParams: Promise<{ q?: SearchParamValue; sort?: SearchParamValue }>;
};

const firstValue = (value: SearchParamValue) => (Array.isArray(value) ? value[0] : value);

// The search is cut to the max length instead of failing validation.
const parseSearch = (value: SearchParamValue) =>
  (firstValue(value) ?? "").trim().slice(0, TASK_SEARCH_MAX_LENGTH).trim();

// Anything that is not a known sort falls back to "newest".
const parseSort = (value: SearchParamValue): TaskSort => {
  const sort = firstValue(value);
  return TASK_SORTS.find((option) => option === sort) ?? "newest";
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = parseSearch(params.q);
  const sort = parseSort(params.sort);

  const initialPage = await serverCaller.tasks.listPaginated({
    limit: TASKS_PAGE_SIZE,
    search: search || undefined,
    sort,
  });

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

      <TasksView initialPage={initialPage} search={search} sort={sort} />
    </main>
  );
}
