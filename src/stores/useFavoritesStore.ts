import { create } from "zustand";
import type { Song } from "../types/appTypes";
import { loadFromStorage } from "../utils/storageUtils";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { syncStoreWithUser, persistStoreData } from "../utils/firebaseStoreUtils";
import type { User } from "firebase/auth";

interface FavoritesState {
  favorites: Song[];
  isLoadedFromCloud: boolean;
  activeUser: User | null;
  addFavorite: (song: Song) => void;
  removeFavorite: (trackId: number) => void;
  isFavorite: (trackId: number) => boolean;
  syncWithUser: (user: User | null) => Promise<void>;
  setActiveUser: (user: User | null) => void;
  persistData: () => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: loadFromStorage<Song[]>(STORAGE_KEYS.FAVORITES) || [],
  isLoadedFromCloud: false,
  activeUser: null,

  addFavorite: (song) => {
    const { persistData } = get();
    set((state) => ({ favorites: [...state.favorites, song] }));
    persistData();
  },

  removeFavorite: (trackId) => {
    const { persistData } = get();
    set((state) => ({
      favorites: state.favorites.filter((song) => song.trackId !== trackId),
    }));
    persistData();
  },

  isFavorite: (trackId) => {
    return get().favorites.some((song) => song.trackId === trackId);
  },

  syncWithUser: async (user) => {
    await syncStoreWithUser<Song[]>({
      user,
      storeKey: STORAGE_KEYS.FAVORITES,
      dataKey: "favorites",
      onDataLoaded: (favorites) => set({ favorites }),
      onSetCloudLoaded: (loaded) => set({ isLoadedFromCloud: loaded }),
      fallbackData: [],
    });
  },

  setActiveUser: (user) => {
    set({ activeUser: user });
  },

  persistData: () => {
    const { favorites, isLoadedFromCloud, activeUser } = get();
    persistStoreData(activeUser, isLoadedFromCloud, STORAGE_KEYS.FAVORITES, "favorites", favorites);
  },
}));

export default useFavoritesStore;
