"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { getErrorMessage, isTRPCClientError } from "@/lib/trpc/errors";
import { createTaskSchema } from "@/lib/validations/task";
import type { Task } from "@/types/task";

type TaskFormProps = {
  task?: Task;
};

type FieldErrors = {
  title?: string;
  description?: string;
};

export function TaskForm({ task }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const parsed = createTaskSchema.safeParse({
      title,
      description: description.trim(),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        title: errors.title?.[0],
        description: errors.description?.[0],
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      if (task) {
        await trpc.tasks.update.mutate({ id: task.id, ...parsed.data });
      } else {
        await trpc.tasks.create.mutate(parsed.data);
      }

      router.push("/");
    } catch (error) {
      const serverFieldErrors = isTRPCClientError(error)
        ? error.data?.zodError?.fieldErrors
        : undefined;

      if (serverFieldErrors) {
        setFieldErrors({
          title: serverFieldErrors.title?.[0],
          description: serverFieldErrors.description?.[0],
        });
      }

      setSubmitError(getErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 aria-invalid:border-red-500"
        />
        {fieldErrors.title && <p className="text-sm text-red-600">{fieldErrors.title}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 aria-invalid:border-red-500"
        />
        {fieldErrors.description && (
          <p className="text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : task ? "Save changes" : "Create task"}
        </button>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
