import type { Song, Playlist } from "../../types/appTypes";

interface PlaylistMenuProps {
  playlists: Playlist[];
  song: Song;
  isSongInPlaylist: (playlistId: string, trackId: number) => boolean;
  onChoosePlaylist?: (song: Song) => void;
  onTogglePlaylist: (playlistId: string) => void;
  onClose: () => void;
}

const PlaylistMenu = ({
  playlists,
  song,
  isSongInPlaylist,
  onChoosePlaylist,
  onTogglePlaylist,
  onClose,
}: PlaylistMenuProps) => {
  return (
    <div className="playlist-menu" onClick={(e) => e.stopPropagation()}>
      <div className="playlist-menu-title">Save to playlist</div>

      <div className="playlist-menu-list">
        {playlists.map((playlist) => {
          const inPlaylist = isSongInPlaylist(playlist.id, song.trackId);

          return (
            <button
              key={playlist.id}
              className={`playlist-menu-item ${inPlaylist ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlaylist(playlist.id);
              }}
            >
              <span className="playlist-name-text">{playlist.name}</span>
              {!inPlaylist && <span className="add-text">Add</span>}
            </button>
          );
        })}
      </div>

      <button
        className="playlist-menu-create"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
          onChoosePlaylist?.(song);
        }}
      >
        Choose playlist page
      </button>
    </div>
  );
};

export default PlaylistMenu;
