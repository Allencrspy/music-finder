export interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl60: string;
  artworkUrl100: string;
  previewUrl?: string;
  collectionName?: string;
  externalUrl?: string;
  source?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export const HOME_PAGE = {
  SEARCH: "search",
  FAVORITES: "favorites",
  PLAYLISTS: "playlists",
  CHOOSE_PLAYLIST: "choose-playlist",
} as const;

export type HomePage = (typeof HOME_PAGE)[keyof typeof HOME_PAGE];

export interface HomeMainContentProps {
  activePage: HomePage;
  currentQuery: string;
  error: string | null;
  favorites: Song[];
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  pendingPlaylistSong: Song | null;
  songs: Song[];
  total: number;
  onChoosePlaylist: (song: Song) => void;
  onLoadMore: () => void;
  onSongSaved: () => void;
}
