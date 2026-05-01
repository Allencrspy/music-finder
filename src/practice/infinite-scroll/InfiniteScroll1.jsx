import { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (isFetching || !hasMore) return;

    try {
      setIsFetching(true);
      const response = (await fetch(`www.api.com?page=${page}`)) || [];

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (!data || !data.length) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [page, isFetching, hasMore]);

  useEffect(() => {
    if (!loaderRef.current) return;

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

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchData, hasMore, isFetching]);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}
      {hasMore ? (
        <div ref={loaderRef}>{isFetching ? "loading" : "scroll for more"}</div>
      ) : (
        <div>end of options</div>
      )}
    </div>
  );
};

export default InfiniteScroll;
