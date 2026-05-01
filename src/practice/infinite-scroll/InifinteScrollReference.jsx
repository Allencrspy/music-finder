import { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteScroll() {
  const [data, setData] = useState([]); // 1. state
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const observerRef = useRef(null); // to persist observer (avoid recreation ❌)

  // 2. Fetch logic
  const fetchData = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    try {
      const res = await fetch(`https://api.example.com/items?page=${page}`);
      const newData = await res.json();

      if (newData.length === 0) {
        setHasMore(false); // 5. stop condition
      } else {
        setData((prev) => [...prev, ...newData]); // append safely
        setPage((prev) => prev + 1); // avoid race condition
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [page, isFetching, hasMore]);

  // 3 & 4. Observer logic
  useEffect(() => {
    if (!loaderRef.current) return;

    // Disconnect previous observer (avoid multiple observers ❌)
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && !isFetching && hasMore) {
        fetchData();
      }
    });

    observerRef.current.observe(loaderRef.current);

    // Cleanup (avoid memory leak ❌)
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchData, isFetching, hasMore]);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}

      {hasMore && <div ref={loaderRef}>Loading...</div>}
      {!hasMore && <p>No more data</p>}
    </div>
  );
}
