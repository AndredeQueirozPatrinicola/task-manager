"use client";

import { useEffect, useState } from "react";
import { usePagination } from "@/app/hooks/usePagination";
import { trpc } from "@/lib/trpc/client";
import { getErrorMessage } from "@/lib/trpc/errors";
import { TASKS_PAGE_SIZE } from "@/lib/validations/task";
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

  return (
    <section className="space-y-3">
      {feedback && (
        <p
          role="status"
          className={
            feedback.type === "success"
              ? "rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
              : "rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          }
        >
          {feedback.message}
        </p>
      )}

      {tasks.length === 0 && !hasMore ? (
        <p className="text-sm text-gray-500">No tasks yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isDeleting={deletingId === task.id}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {hasMore && <div ref={sentinelRef} />}

      {isLoading && <p className="text-center text-sm text-gray-500">Loading more tasks...</p>}

      {loadError !== null && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-red-600">{getErrorMessage(loadError)}</span>
          <button type="button" onClick={loadMore} className="text-gray-700 underline">
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
