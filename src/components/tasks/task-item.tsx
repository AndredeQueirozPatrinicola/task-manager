import Link from "next/link";
import type { Task } from "@/types/task";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { iconButton } from "@/components/ui/styles";

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
  const createdAt = dateFormatter.format(task.createdAt);

  return (
    <tr className="transition-colors hover:bg-gray-50/70">
      <td className="px-4 py-3.5 align-top">
        <p className="font-medium text-gray-900 wrap-break-word">{task.title}</p>
        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-gray-500 wrap-break-word">{task.description}</p>
        )}
        <time dateTime={task.createdAt.toISOString()} className="mt-1 block text-xs text-gray-400 sm:hidden">
          {createdAt}
        </time>
      </td>

      <td className="hidden px-4 py-3.5 align-top whitespace-nowrap text-gray-500 tabular-nums sm:table-cell">
        <time dateTime={task.createdAt.toISOString()}>{createdAt}</time>
      </td>

      <td className="px-3 py-2.5 align-top">
        <div className="flex justify-end gap-0.5">
          <Link
            href={`/tasks/${task.id}/edit`}
            aria-label={`Edit "${task.title}"`}
            title="Edit"
            className={iconButton}
          >
            <PencilIcon />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            aria-label={`Delete "${task.title}"`}
            title="Delete"
            className={`${iconButton} hover:bg-red-50 hover:text-red-600`}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
