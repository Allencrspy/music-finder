import { createContext, useContext, useState } from "react";

const RecentlyPlayedContext = createContext();

export const RecentlyPlayedProvider = ({ children }) => {
  const [recentSongs, setRecentSongs] = useState([]);

  const addRecentSong = (song) => {
    setRecentSongs((prev) => {
      const filtered = prev.filter((item) => item.trackId !== song.trackId);

      return [song, ...filtered].slice(0, 10);
    });
  };

  return (
    <RecentlyPlayedContext.Provider value={{ recentSongs, addRecentSong }}>
      {children}
    </RecentlyPlayedContext.Provider>
  );
};

export const useRecentlyPlayed = () => {
  return useContext(RecentlyPlayedContext);
};
