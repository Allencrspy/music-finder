import { useCallback } from "react";
import * as FileSaver from "file-saver";
import useFavoritesStore from "../stores/useFavoritesStore";
import usePlaylistStore from "../stores/usePlaylistStore";
import useNowPlayingStore from "../stores/useNowPlayingStore";
import { type Song } from "../types/appTypes";

export const useSongInteraction = (song: Song) => {
  // Pull state and actions from separate specialized stores
  const { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite 
  } = useFavoritesStore();
  
  const { 
    playlists, 
    addSongToPlaylist, 
    removeSongFromPlaylist, 
    isSongInPlaylist 
  } = usePlaylistStore();
  
  const { 
    currentSong, 
    isPlaying, 
    setCurrentSong, 
    setIsPlaying 
  } = useNowPlayingStore();

  const favorite = isFavorite(song.trackId);
  const nowPlaying = currentSong?.trackId === song.trackId;
  const showWaveform = nowPlaying && isPlaying;

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(song.trackId);
    } else {
      addFavorite(song);
    }
  }, [favorite, song, addFavorite, removeFavorite]);

  const togglePlaylist = useCallback((playlistId: string) => {
    if (isSongInPlaylist(playlistId, song.trackId)) {
      removeSongFromPlaylist(playlistId, song.trackId);
    } else {
      addSongToPlaylist(playlistId, song);
    }
  }, [song, isSongInPlaylist, addSongToPlaylist, removeSongFromPlaylist]);

  const playSong = useCallback(() => {
    if (nowPlaying) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  }, [nowPlaying, isPlaying, song, setCurrentSong, setIsPlaying]);

  const downloadSong = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!song.previewUrl) return;

    try {
      const response = await fetch(song.previewUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const fileName = `${song.trackName} - ${song.artistName}.mp3`.replace(/[\\/:*?"<>|]/g, "");
      FileSaver.saveAs(blob, fileName);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, [song]);

  return {
    favorite,
    nowPlaying,
    showWaveform,
    playlists,
    isSongInPlaylist,
    toggleFavorite,
    togglePlaylist,
    playSong,
    downloadSong,
  };
};
