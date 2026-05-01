import { useState } from "react";
import PlaylistCard from "./PlaylistCard";
import PlaylistForm from "./PlaylistForm";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { Playlist } from "../../types/appTypes";

interface PlaylistOverviewProps {
  creationError: string;
  newPlaylistName: string;
  playlists: Playlist[];
  onCreatePlaylist: (e: React.FormEvent) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPlaylist: (playlistId: string) => void;
}

const PlaylistOverview = ({
  creationError,
  newPlaylistName,
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onNameChange,
  onOpenPlaylist,
}: PlaylistOverviewProps) => {
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (playlistToDelete) {
      onDeletePlaylist(playlistToDelete);
      setPlaylistToDelete(null);
    }
  };

  return (
    <section className="playlist-browser-page">
      <div className="section-header">
        <div className="header-left">
          <h2>Playlists</h2>
          <span className="results-count">
            Browse your saved playlists and jump into their tracks.
          </span>
        </div>

        <div className="header-actions">
          <PlaylistForm
            buttonLabel="Create"
            creationError={creationError}
            inputValue={newPlaylistName}
            onChange={onNameChange}
            onSubmit={onCreatePlaylist}
            placeholder="New playlist"
          />
        </div>
      </div>

      <div className="playlist-browser-grid">
        {playlists.map((playlist) => (
          <PlaylistCard 
            key={playlist.id} 
            playlist={playlist} 
            onOpen={onOpenPlaylist} 
            onDelete={setPlaylistToDelete}
          />
        ))}
      </div>

      <Modal isOpen={!!playlistToDelete} onClose={() => setPlaylistToDelete(null)} title="Delete Playlist?">
        <p style={{textAlign: "center", color: "#a0a0a0", marginBottom: "16px"}}>
          Are you sure you want to delete this playlist? This action cannot be undone.
        </p>
        <div style={{display: "flex", gap: "12px"}}>
          <Button variant="outline" fullWidth onClick={() => setPlaylistToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      {!playlists.length && (
        <div className="playlist-browser-empty">
          No playlists yet. Create one and start building your library.
        </div>
      )}
    </section>
  );
};

export default PlaylistOverview;
