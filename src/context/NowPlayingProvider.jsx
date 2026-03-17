import { createContext, useContext, useState } from "react";

const NowPlayingContext = createContext();

export const NowPlayingProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  return (
    <NowPlayingContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </NowPlayingContext.Provider>
  );
};

export const useNowPlaying = () => useContext(NowPlayingContext);
