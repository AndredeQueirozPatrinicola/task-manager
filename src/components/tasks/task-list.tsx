"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePagination } from "@/app/hooks/usePagination";
import { trpc } from "@/lib/trpc/client";
import { getErrorMessage } from "@/lib/trpc/errors";
import { TASKS_PAGE_SIZE } from "@/lib/validations/task";
import { PlusIcon } from "@/components/ui/icons";
import { secondaryButton } from "@/components/ui/styles";
import type { PaginatedTasks, Task, TaskCursor } from "@/types/task";
import { TaskItem } from "./task-item";

type Feedback = {
  type: "success" | "error";
  message: string;
};

type TaskListProps = {
  initialPage: PaginatedTasks;
};

const fetchTasks = (cursor: TaskCursor) =>
  trpc.tasks.listPaginated.query({ limit: TASKS_PAGE_SIZE, cursor });

export function TaskList({ initialPage }: TaskListProps) {
  const {
    items: tasks,
    setItems: setTasks,
    hasMore,
    isLoading,
    error: loadError,
    loadMore,
    sentinelRef,
  } = usePagination({ initialPage, fetchPage: fetchTasks });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!feedback) return;

    const timeout = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    setDeletingId(task.id);

    try {
      await trpc.tasks.delete.mutate({ id: task.id });
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setFeedback({ type: "success", message: "Task deleted." });
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
    }
  }

  if (tasks.length === 0 && !hasMore) {
    return (
      <>
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-gray-900">No tasks yet</p>
          <p className="mt-1 text-sm text-gray-500">Create your first task to get started.</p>
          <Link href="/tasks/new" className={`${secondaryButton} mt-5`}>
            <PlusIcon />
            New task
          </Link>
        </div>
        <Toast feedback={feedback} />
      </>
    );
  }

  return (
    <section>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-gray-200 bg-gray-50/80 text-left text-xs text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Task
              </th>
              <th scope="col" className="hidden w-48 px-4 py-2.5 font-medium sm:table-cell">
                Created
              </th>
              <th scope="col" className="w-24 px-4 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isDeleting={deletingId === task.id}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        {hasMore && <div ref={sentinelRef} />}

        {isLoading && (
          <p className="border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-500">
            Loading more tasks...
          </p>
        )}

        {loadError !== null && (
          <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-4 py-3 text-xs">
            <span className="text-red-600">{getErrorMessage(loadError)}</span>
            <button type="button" onClick={loadMore} className="font-medium text-gray-700 underline">
              Try again
            </button>
          </div>
        )}
      </div>

      <Toast feedback={feedback} />
    </section>
  );
}

function Toast({ feedback }: { feedback: Feedback | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-10 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      {feedback && (
        <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-lg">
          <span
            className={`size-2 rounded-full ${feedback.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          />
          {feedback.message}
        </div>
      )}
    </div>
  );
}
