import { useEffect, useRef, memo } from "react";
import SongGrid from "./SongGrid";
import logoIcon from "../../assets/logo.svg";
import { type Song } from "../../types/appTypes";

interface SearchSectionProps {
  songs: Song[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  currentQuery: string;
  total: number;
  onLoadMore: () => void;
  onChoosePlaylist: (song: Song) => void;
}

const SearchSection = memo(({
  songs,
  loading,
  loadingMore,
  hasMore,
  currentQuery,
  total,
  onLoadMore,
  onChoosePlaylist,
}: SearchSectionProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 },
    );

    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, onLoadMore]);

  if (!currentQuery && !loading) {
    return (
      <div className="empty-state">
        <img src={logoIcon} alt="Music Finder" className="welcome-logo" />
        <h2>Welcome to Music Finder</h2>
        <p>Search for songs to build your own library.</p>
      </div>
    );
  }

  return (
    <div className="search-page-container">
      <div className="section-header">
        <div className="header-left">
          <h2>Search Results</h2>
          {total > 0 && (
            <span className="results-count">
              Showing {total} results for "{currentQuery}"
            </span>
          )}
        </div>
      </div>

      <div className="grid-wrapper">
        <SongGrid
          songs={songs}
          loading={loading}
          loadingMore={loadingMore}
          onChoosePlaylist={onChoosePlaylist}
          skeletonKeyPrefix="search"
        />
      </div>

      {hasMore && <div ref={triggerRef} className="load-more-trigger" />}
    </div>
  );
});

export default SearchSection;
