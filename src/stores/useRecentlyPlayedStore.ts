import { create } from "zustand";
import type { Song } from "../types/appTypes";

interface RecentlyPlayedState {
  recentSongs: Song[];
  addRecentSong: (song: Song) => void;
}

const MAX_RECENT = 10;

const useRecentlyPlayedStore = create<RecentlyPlayedState>((set) => ({
  recentSongs: [],

  addRecentSong: (song) =>
    set((state) => {
      const filtered = state.recentSongs.filter(
        (item) => item.trackId !== song.trackId,
      );
      return { recentSongs: [song, ...filtered].slice(0, MAX_RECENT) };
    }),
}));

export default useRecentlyPlayedStore;
