"use client";

import { useRef } from "react";
import { ChevronDownIcon, SearchIcon, SpinnerIcon, XIcon } from "@/components/ui/icons";
import { inputField } from "@/components/ui/styles";
import { TASK_SEARCH_MAX_LENGTH } from "@/lib/validations/task";
import type { TaskSort } from "@/types/task";

const SORT_OPTIONS: { value: TaskSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title_asc", label: "Title (A–Z)" },
  { value: "title_desc", label: "Title (Z–A)" },
];

type TaskToolbarProps = {
  search: string;
  sort: TaskSort;
  isPending: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: TaskSort) => void;
  onClearSearch: () => void;
};

export function TaskToolbar({
  search,
  sort,
  isPending,
  onSearchChange,
  onSortChange,
  onClearSearch,
}: TaskToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    onClearSearch();
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div role="search" className="relative flex-1">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          {isPending ? <SpinnerIcon /> : <SearchIcon />}
        </span>
        <input
          ref={inputRef}
          id="task-search"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Search by title or description"
          maxLength={TASK_SEARCH_MAX_LENGTH}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && search) {
              event.preventDefault();
              handleClear();
            }
          }}
          className={`${inputField} pr-9 pl-9`}
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-900"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      <div className="relative sm:w-44">
        <label htmlFor="task-sort" className="sr-only">
          Sort tasks
        </label>
        <select
          id="task-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as TaskSort)}
          className={`${inputField} cursor-pointer appearance-none pr-9`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}
