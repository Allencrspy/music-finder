import type { Playlist, Song } from "../types/appTypes";

export const createPlaylistId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `playlist-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const hasPlaylistName = (playlists: Playlist[], name: string): boolean => {
  return playlists.some(
    (playlist) => playlist.name.toLowerCase() === name.toLowerCase(),
  );
};

export const prependSongIfMissing = (songs: Song[], nextSong: Song): Song[] => {
  const alreadyExists = songs.some((song) => song.trackId === nextSong.trackId);
  return alreadyExists ? songs : [nextSong, ...songs];
};
