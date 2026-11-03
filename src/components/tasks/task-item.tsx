import Link from "next/link";
import type { Task } from "@/types/task";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type TaskItemProps = {
  task: Task;
  isDeleting: boolean;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, isDeleting, onDelete }: TaskItemProps) {
  return (
    <li className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-medium break-words">{task.title}</h2>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 break-words">{task.description}</p>
          )}
          <time
            dateTime={task.createdAt.toISOString()}
            className="mt-2 block text-xs text-gray-400"
          >
            {dateFormatter.format(task.createdAt)}
          </time>
        </div>

        <div className="flex shrink-0 gap-3 text-sm">
          <Link href={`/tasks/${task.id}/edit`} className="text-gray-600 hover:underline">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            className="text-red-600 hover:underline disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </li>
  );
}
