import { getHighResArtwork } from "../../utils/imageUtils";
import type { Playlist } from "../../types/appTypes";

interface PlaylistCardProps {
  playlist: Playlist;
  onOpen: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PlaylistCard = ({ playlist, onOpen, onDelete }: PlaylistCardProps) => {
  const coverSong = playlist.songs[0];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(playlist.id);
  };

  return (
    <button className="playlist-browser-card" onClick={() => onOpen(playlist.id)}>
      <div className="song-artwork-wrapper">
        {coverSong ? (
          <img
            className="playlist-browser-cover"
            src={getHighResArtwork(coverSong.artworkUrl100)}
            alt={playlist.name}
          />
        ) : (
          <div className="playlist-browser-cover playlist-browser-empty-cover">
            {playlist.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        {onDelete && (
          <div className="song-card-actions">
            <button 
              className="favorite-btn" 
              onClick={handleDelete}
              title="Delete Playlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="playlist-browser-card-name">{playlist.name}</div>
      <div className="playlist-browser-card-meta">
        {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
      </div>
    </button>
  );
};

export default PlaylistCard;
