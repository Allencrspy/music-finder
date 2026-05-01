import PlaylistCard from "./PlaylistCard";
import PlaylistForm from "./PlaylistForm";
import type { Song, Playlist } from "../../types/appTypes";

interface PlaylistChooserProps {
  creationError: string;
  newPlaylistName: string;
  pendingSong: Song;
  playlists: Playlist[];
  onCreatePlaylist: (e: React.FormEvent) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickPlaylist: (playlistId: string) => void;
}

const PlaylistChooser = ({
  creationError,
  newPlaylistName,
  pendingSong,
  playlists,
  onCreatePlaylist,
  onNameChange,
  onPickPlaylist,
}: PlaylistChooserProps) => {
  return (
    <section className="playlist-browser-page">
      <h1 className="playlist-browser-title">Choose Playlist</h1>
      <p className="playlist-browser-subtitle">
        Add <strong>{pendingSong.trackName}</strong> to one of your playlists.
      </p>

      <PlaylistForm
        buttonLabel="Create"
        creationError={creationError}
        inputValue={newPlaylistName}
        onChange={onNameChange}
        onSubmit={onCreatePlaylist}
        placeholder="Create playlist"
      />

      <div className="playlist-browser-grid">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onOpen={onPickPlaylist} />
        ))}
      </div>

      {!playlists.length && (
        <div className="playlist-browser-empty">
          Create your first playlist to start saving songs.
        </div>
      )}
    </section>
  );
};

export default PlaylistChooser;
