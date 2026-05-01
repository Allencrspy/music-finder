import { create } from "zustand";
import type { Song } from "../types/appTypes";

interface NowPlayingState {
  currentSong: Song | null;
  isPlaying: boolean;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
}

const useNowPlayingStore = create<NowPlayingState>((set) => ({
  currentSong: null,
  isPlaying: false,

  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));

export default useNowPlayingStore;
