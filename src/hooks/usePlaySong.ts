import { useCallback } from "react";
import useNowPlayingStore from "../stores/useNowPlayingStore";
import useRecentlyPlayedStore from "../stores/useRecentlyPlayedStore";
import type { Song } from "../types/appTypes";

export const usePlaySong = () => {
  const setCurrentSong = useNowPlayingStore((s) => s.setCurrentSong);
  const setIsPlaying = useNowPlayingStore((s) => s.setIsPlaying);
  const currentSong = useNowPlayingStore((s) => s.currentSong);
  const addRecentSong = useRecentlyPlayedStore((s) => s.addRecentSong);

  const playSong = useCallback((song: Song) => {
    if (currentSong?.trackId === song.trackId) {
      setIsPlaying(true);
    } else {
      setCurrentSong(song);
      addRecentSong(song);
    }
  }, [currentSong, setCurrentSong, setIsPlaying, addRecentSong]);

  return playSong;
};
