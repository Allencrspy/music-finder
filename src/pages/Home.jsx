import { useEffect, useState } from "react";
import useMusicSearch from "../hooks/useMusicSearch";
import useDebounce from "../hooks/useDebounce";

import SearchBar from "../components/search-bar/SearchBar";
import SongCard from "../components/song-card/SongCard";
import FavoritesList from "../components/favorites-list/FavoritesList";
import RecentlyPlayedList from "../components/recently-played/RecentlyPlayedList";
import NowPlayingAudio from "../components/now-playing-audio/NowPlayingAudio";

import { useNowPlaying } from "../context/NowPlayingProvider";

import "./Home.css";

const Home = () => {
  const { search, songs, loading, error } = useMusicSearch();

  const { currentSong } = useNowPlaying();

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className="home-container">
      <aside className="home-sidebar">
        <div className="home-title">Music Finder</div>

        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={() => search(query)}
        />

        <div className="favorites-section">
          <h3>Favorites</h3>
          <FavoritesList />
        </div>

        <RecentlyPlayedList />
      </aside>

      <main className="home-main">
        {error && <div className="status error">{error}</div>}

        <div className="song-grid">
          {loading &&
            Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="song-card-skeleton" />
            ))}

          {!loading &&
            songs.map((song) => <SongCard key={song.trackId} song={song} />)}
        </div>
      </main>

      {currentSong && <NowPlayingAudio />}
    </div>
  );
};

export default Home;
