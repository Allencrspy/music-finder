import { useEffect, useRef } from "react";
import PlaylistBrowser from "../playlist-browser/PlaylistBrowser";
import SearchSection from "./SearchSection";
import FavoritesSection from "./FavoritesSection";
import { HOME_PAGE, type HomeMainContentProps } from "../../types/appTypes";
import logoIcon from "../../assets/logo.svg";

const HomeMainContent = ({
  activePage,
  currentQuery,
  error,
  favorites,
  hasMore,
  loading,
  loadingMore,
  pendingPlaylistSong,
  songs,
  total,
  onChoosePlaylist,
  onLoadMore,
  onSongSaved,
}: HomeMainContentProps) => {
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activePage === HOME_PAGE.SEARCH && currentQuery) {
      mainContentRef.current?.scrollTo({ top: 0 });
    }
  }, [activePage, currentQuery]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="empty-state error-state">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      );
    }

    switch (activePage) {
      case HOME_PAGE.SEARCH:
        return (
          <SearchSection
            songs={songs}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            currentQuery={currentQuery}
            total={total}
            onLoadMore={onLoadMore}
            onChoosePlaylist={onChoosePlaylist}
          />
        );

      case HOME_PAGE.FAVORITES:
        return (
          <FavoritesSection
            favorites={favorites}
            onChoosePlaylist={onChoosePlaylist}
          />
        );

      case HOME_PAGE.PLAYLISTS:
      case HOME_PAGE.CHOOSE_PLAYLIST:
        return (
          <PlaylistBrowser
            pendingSong={pendingPlaylistSong}
            onSongSaved={onSongSaved}
          />
        );

      default:
        return null;
    }
  };

  return (
    <main className="home-main-content" ref={mainContentRef}>
      <div className="content-container">{renderContent()}</div>
    </main>
  );
};

export default HomeMainContent;
