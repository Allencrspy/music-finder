import IconButton from "../ui/IconButton";
import SongGrid from "../home/SongGrid";
import type { Playlist, Song } from "../../types/appTypes";

interface PlaylistDetailProps {
  playlist: Playlist;
  onBack: () => void;
  onRemoveSong: (playlistId: string, trackId: number) => void;
  onPlaySong: (song: Song) => void;
}

const PlaylistDetail = ({ playlist, onBack, onRemoveSong }: PlaylistDetailProps) => {
  return (
    <section className="playlist-detail-page">
      <div className="section-header">
        <div className="header-left">
          <div className="title-with-back">
            <IconButton
              icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>}
              variant="outline"
              onClick={onBack}
            />
            <h2>{playlist.name}</h2>
          </div>
          <span className="results-count">
            {playlist.songs.length} {playlist.songs.length === 1 ? "track" : "tracks"} saved
          </span>
        </div>
      </div>

      <div className="grid-wrapper">
        <SongGrid
          songs={playlist.songs}
          onRemove={(song) => onRemoveSong(playlist.id, song.trackId)}
        />
      </div>

      {!playlist.songs.length && (
        <div className="empty-state">
          <h2>This playlist is empty</h2>
          <p>Add songs from search results using the + button to see them here.</p>
        </div>
      )}
    </section>
  );
};

export default PlaylistDetail;
