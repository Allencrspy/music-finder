import { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storageUtils";
import { STORAGE_KEYS } from "../constants/storageKeys";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.FAVORITES) || [];
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const addFavorite = (song) => {
    setFavorites((prev) => [...prev, song]);
  };

  const removeFavorite = (trackId) => {
    setFavorites((prev) => prev.filter((song) => song.trackId !== trackId));
  };

  const isFavorite = (trackId) => {
    return favorites.some((song) => song.trackId === trackId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
