import { useEffect, useState, useCallback } from "react";
import useMusicSearch from "../hooks/useMusicSearch";
import useDebounce from "../hooks/useDebounce";
import HomeMainContent from "../components/home/HomeMainContent";
import HomeSidebar from "../components/home/HomeSidebar";
import NowPlayingAudio from "../components/now-playing-audio/NowPlayingAudio";

import useNowPlayingStore from "../stores/useNowPlayingStore";
import useFavoritesStore from "../stores/useFavoritesStore";
import { HOME_PAGE, type HomePage, type Song } from "../types/appTypes";

import "./Home.css";

const Home = () => {
  const {
    search,
    loadMore,
    songs,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    currentQuery,
  } = useMusicSearch();
  const currentSong = useNowPlayingStore((s) => s.currentSong);
  const favorites = useFavoritesStore((s) => s.favorites);

  const [query, setQuery] = useState("");
  const [activePage, setActivePage] = useState<HomePage>(HOME_PAGE.SEARCH);
  const [pendingPlaylistSong, setPendingPlaylistSong] = useState<Song | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    if (nextQuery.trim()) {
      setPendingPlaylistSong(null);
      setActivePage(HOME_PAGE.SEARCH);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setPendingPlaylistSong(null);
    setActivePage(HOME_PAGE.SEARCH);
    search(query);
  }, [query, search]);

  const handleSearchFocus = useCallback(() => {
    setPendingPlaylistSong(null);
    setActivePage(HOME_PAGE.SEARCH);
  }, []);

  const handleChoosePlaylist = useCallback((song: Song) => {
    setPendingPlaylistSong(song);
    setActivePage(HOME_PAGE.CHOOSE_PLAYLIST);
  }, []);

  const handleSongSaved = useCallback(() => {
    setPendingPlaylistSong(null);
    setActivePage(HOME_PAGE.PLAYLISTS);
  }, []);

  const handleNavigate = useCallback((page: HomePage) => {
    setPendingPlaylistSong(null);
    setActivePage(page);
  }, []);

  return (
    <div className="home-container">
      <HomeSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        query={query}
        setQuery={handleQueryChange}
        onSearchFocus={handleSearchFocus}
        onSearch={handleSearch}
      />

      <HomeMainContent
        activePage={activePage}
        currentQuery={currentQuery}
        error={error}
        favorites={favorites}
        hasMore={hasMore}
        loading={loading}
        loadingMore={loadingMore}
        pendingPlaylistSong={pendingPlaylistSong}
        songs={songs}
        total={total}
        onChoosePlaylist={handleChoosePlaylist}
        onLoadMore={loadMore}
        onSongSaved={handleSongSaved}
      />

      {currentSong && <NowPlayingAudio />}
    </div>
  );
};

export default Home;
