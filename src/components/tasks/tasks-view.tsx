"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TASK_SEARCH_MAX_LENGTH } from "@/lib/validations/task";
import type { PaginatedTasks, TaskSort } from "@/types/task";
import { TaskList } from "./task-list";
import { TaskToolbar } from "./task-toolbar";

const SEARCH_DEBOUNCE_MS = 300;

type Filters = {
  search: string;
  sort: TaskSort;
};

type TasksViewProps = {
  initialPage: PaginatedTasks;
  // Already normalized by the page. These are the filters the current list was loaded with.
  search: string;
  sort: TaskSort;
};

const normalizeSearch = (value: string) => value.trim().slice(0, TASK_SEARCH_MAX_LENGTH).trim();

/*
    Search input and list live together so the "Clear search" button from the
    empty state can also clear the text in the input.
*/
export function TasksView({ initialPage, search, sort }: TasksViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(search);
  const [sortInput, setSortInput] = useState(sort);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestedRef = useRef<Filters>({ search, sort });

  const updateUrl = useCallback(
    (filters: Filters) => {
      clearTimeout(debounceRef.current);

      const next = { search: normalizeSearch(filters.search), sort: filters.sort };
      const current = requestedRef.current;
      if (next.search === current.search && next.sort === current.sort) return;

      requestedRef.current = next;

      const params = new URLSearchParams();
      if (next.search) params.set("q", next.search);
      if (next.sort !== "newest") params.set("sort", next.sort);
      const query = params.toString();

      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  // When the URL changes from outside (e.g. the header link back to "/"), sync the inputs.
  useEffect(() => {
    const requested = requestedRef.current;
    if (search === requested.search && sort === requested.sort) return;

    requestedRef.current = { search, sort };
    setSearchInput(search);
    setSortInput(sort);
  }, [search, sort]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => updateUrl({ search: value, sort: sortInput }),
      SEARCH_DEBOUNCE_MS,
    );
  }

  function handleSortChange(value: TaskSort) {
    setSortInput(value);
    updateUrl({ search: searchInput, sort: value });
  }

  function handleClearSearch() {
    setSearchInput("");
    updateUrl({ search: "", sort: sortInput });
  }

  return (
    <div className="space-y-4">
      <TaskToolbar
        search={searchInput}
        sort={sortInput}
        isPending={isPending}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onClearSearch={handleClearSearch}
      />

      <div aria-busy={isPending} className={`transition-opacity ${isPending ? "opacity-60" : ""}`}>
        <TaskList
          key={`${sort}:${search}`}
          initialPage={initialPage}
          search={search}
          sort={sort}
          onClearSearch={handleClearSearch}
        />
      </div>
    </div>
  );
}
