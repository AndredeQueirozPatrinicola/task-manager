import Link from "next/link";
import type { Task } from "@/types/task";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className="rounded border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-medium break-words">{task.title}</h2>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 break-words">{task.description}</p>
          )}
          {task.createdAt && (
            <time
              dateTime={task.createdAt.toISOString()}
              className="mt-2 block text-xs text-gray-400"
            >
              {dateFormatter.format(task.createdAt)}
            </time>
          )}
        </div>

        <Link
          href={`/tasks/${task.id}/edit`}
          className="shrink-0 text-sm text-gray-600 hover:underline"
        >
          Edit
        </Link>
      </div>
    </li>
  );
}
