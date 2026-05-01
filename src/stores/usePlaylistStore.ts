import { create } from "zustand";
import type { Playlist, Song } from "../types/appTypes";
import { loadFromStorage } from "../utils/storageUtils";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {
  createPlaylistId,
  hasPlaylistName,
  prependSongIfMissing,
} from "../utils/playlistUtils";
import { syncStoreWithUser, persistStoreData } from "../utils/firebaseStoreUtils";
import type { User } from "firebase/auth";

interface PlaylistState {
  playlists: Playlist[];
  isLoadedFromCloud: boolean;
  activeUser: User | null;
  createPlaylist: (name: string) => boolean;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, trackId: number) => void;
  isSongInPlaylist: (playlistId: string, trackId: number) => boolean;
  syncWithUser: (user: User | null) => Promise<void>;
  setActiveUser: (user: User | null) => void;
  persistData: () => void;
}

const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: loadFromStorage<Playlist[]>(STORAGE_KEYS.PLAYLISTS) || [],
  isLoadedFromCloud: false,
  activeUser: null,

  createPlaylist: (name) => {
    const { persistData } = get();
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    if (hasPlaylistName(get().playlists, trimmedName)) return false;

    set((state) => ({
      playlists: [
        { id: createPlaylistId(), name: trimmedName, songs: [] },
        ...state.playlists,
      ],
    }));
    persistData();
    return true;
  },

  deletePlaylist: (playlistId) => {
    const { persistData } = get();
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== playlistId),
    }));
    persistData();
  },

  addSongToPlaylist: (playlistId, song) => {
    const { persistData } = get();
    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        return {
          ...playlist,
          songs: prependSongIfMissing(playlist.songs, song),
        };
      }),
    }));
    persistData();
  },

  removeSongFromPlaylist: (playlistId, trackId) => {
    const { persistData } = get();
    set((state) => ({
      playlists: state.playlists.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;
        return {
          ...playlist,
          songs: playlist.songs.filter((song) => song.trackId !== trackId),
        };
      }),
    }));
    persistData();
  },

  isSongInPlaylist: (playlistId, trackId) => {
    const playlist = get().playlists.find((item) => item.id === playlistId);
    return playlist
      ? playlist.songs.some((song) => song.trackId === trackId)
      : false;
  },

  syncWithUser: async (user) => {
    await syncStoreWithUser<Playlist[]>({
      user,
      storeKey: STORAGE_KEYS.PLAYLISTS,
      dataKey: "playlists",
      onDataLoaded: (playlists) => set({ playlists }),
      onSetCloudLoaded: (loaded) => set({ isLoadedFromCloud: loaded }),
      fallbackData: [],
    });
  },

  setActiveUser: (user) => {
    set({ activeUser: user });
  },

  persistData: () => {
    const { playlists, isLoadedFromCloud, activeUser } = get();
    persistStoreData(activeUser, isLoadedFromCloud, STORAGE_KEYS.PLAYLISTS, "playlists", playlists);
  },
}));

export default usePlaylistStore;
