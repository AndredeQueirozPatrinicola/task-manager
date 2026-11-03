"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { getErrorMessage, isTRPCClientError } from "@/lib/trpc/errors";
import { createTaskSchema } from "@/lib/validations/task";
import type { Task } from "@/types/task";
import { inputField, primaryButton, secondaryButton } from "@/components/ui/styles";

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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-gray-200 bg-white shadow-xs"
    >
      <div className="space-y-5 p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Review pull requests"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
            className={`${inputField} mt-1.5`}
          />
          {fieldErrors.title && (
            <p id="title-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add any details that help you get it done."
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? "description-error" : undefined}
            className={`${inputField} mt-1.5 resize-y`}
          />
          {fieldErrors.description && (
            <p id="description-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {submitError && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-100 bg-gray-50/60 px-6 py-4">
        <Link href="/" className={secondaryButton}>
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className={primaryButton}>
          {isSubmitting ? "Saving..." : task ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}
