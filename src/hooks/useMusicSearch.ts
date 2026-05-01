import { useCallback, useRef, useState } from "react";
import { searchJamendoTracks } from "../services/musicService";
import { type Song } from "../types/appTypes";

const PAGE_SIZE = 20;

interface MusicSearchReturn {
  songs: Song[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  currentQuery: string;
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const useMusicSearch = (): MusicSearchReturn => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === currentQuery) return;

      if (!trimmedQuery) {
        setSongs([]);
        setError(null);
        setCurrentQuery("");
        setNextOffset(null);
        setTotal(0);
        setLoading(false);
        return;
      }

      if (trimmedQuery.length < 2) {
        setSongs([]);
        setError("Please enter at least 2 characters to search");
        setCurrentQuery(trimmedQuery);
        setNextOffset(null);
        setTotal(0);
        setLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);
      setCurrentQuery(trimmedQuery);
      setNextOffset(null);
      setTotal(0);

      try {
        const result = await searchJamendoTracks({
          limit: PAGE_SIZE,
          offset: 0,
          query: trimmedQuery,
          signal: controller.signal,
        });

        setSongs(result.items);
        setNextOffset(result.next);
        setTotal(result.total);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return; 
        }

        console.error(err);
        setSongs([]);
        setError((err as Error).message || "Failed to fetch songs");
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [currentQuery],
  );

  const loadMore = useCallback(async () => {
    if (!currentQuery || nextOffset === null || loadingMore) return;

    // For "load more", we don't necessarily want to abort the main search, 
    // but we should manage its own controller if we wanted to prevent parallel loads.
    // For now, let's keep it simple or use the same pattern.
    const controller = new AbortController();

    setLoadingMore(true);
    setError(null);

    try {
      const result = await searchJamendoTracks({
        limit: PAGE_SIZE,
        offset: nextOffset,
        query: currentQuery,
        signal: controller.signal,
      });

      setSongs((prev) => {
        const existingIds = new Set(prev.map((song) => song.trackId));
        const nextSongs = result.items.filter(
          (song) => !existingIds.has(song.trackId),
        );

        return [...prev, ...nextSongs];
      });
      setNextOffset(result.next);
      setTotal(result.total);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;

      console.error(err);
      setError((err as Error).message || "Failed to fetch more songs");
    } finally {
      setLoadingMore(false);
    }
  }, [currentQuery, loadingMore, nextOffset]);

  return {
    songs,
    loading,
    loadingMore,
    error,
    hasMore: nextOffset !== null,
    total,
    currentQuery,
    search,
    loadMore,
  };
};

export default useMusicSearch;
