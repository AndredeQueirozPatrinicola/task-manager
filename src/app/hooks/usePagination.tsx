import { useCallback, useEffect, useRef, useState } from "react";

type Page<TItem, TCursor> = {
  items: TItem[];
  nextCursor: TCursor | null;
};

type UsePaginationOptions<TItem, TCursor> = {
  initialPage: Page<TItem, TCursor>;
  fetchPage: (cursor: TCursor) => Promise<Page<TItem, TCursor>>;
};

export function usePagination<TItem, TCursor>({
  initialPage,
  fetchPage,
}: UsePaginationOptions<TItem, TCursor>) {
  const [items, setItems] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (cursor === null || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const page = await fetchPage(cursor);
      setItems((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
    } catch (loadError) {
      setError(loadError);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [cursor, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || cursor === null || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, error, loadMore]);

  return {
    items,
    setItems,
    hasMore: cursor !== null,
    isLoading,
    error,
    loadMore,
    sentinelRef,
  };
}
