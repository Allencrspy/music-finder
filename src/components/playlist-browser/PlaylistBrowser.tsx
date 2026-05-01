import { useState } from "react";
import usePlaylistStore from "../../stores/usePlaylistStore";
import { usePlaySong } from "../../hooks/usePlaySong";
import PlaylistChooser from "./PlaylistChooser";
import PlaylistDetail from "./PlaylistDetail";
import PlaylistOverview from "./PlaylistOverview";
import type { Song } from "../../types/appTypes";
import "./PlaylistBrowser.css";

interface PlaylistBrowserProps {
  pendingSong: Song | null;
  onSongSaved: () => void;
}

const PlaylistBrowser = ({ pendingSong, onSongSaved }: PlaylistBrowserProps) => {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  } = usePlaylistStore();
  
  const playSong = usePlaySong();
  
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creationError, setCreationError] = useState("");

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId,
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlaylistName(e.target.value);
    if (creationError) setCreationError("");
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();

    const created = createPlaylist(newPlaylistName);

    if (!created) {
      setCreationError("Use a unique playlist name.");
      return;
    }

    setNewPlaylistName("");
    setCreationError("");
  };

  const handlePickPlaylist = (playlistId: string) => {
    if (!pendingSong) return;

    addSongToPlaylist(playlistId, pendingSong);
    onSongSaved();
  };

  if (pendingSong) {
    return (
      <PlaylistChooser
        creationError={creationError}
        newPlaylistName={newPlaylistName}
        pendingSong={pendingSong}
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onNameChange={handleNameChange}
        onPickPlaylist={handlePickPlaylist}
      />
    );
  }

  if (selectedPlaylist) {
    return (
      <PlaylistDetail
        playlist={selectedPlaylist}
        onBack={() => setSelectedPlaylistId(null)}
        onPlaySong={playSong}
        onRemoveSong={removeSongFromPlaylist}
      />
    );
  }

  return (
    <PlaylistOverview
      creationError={creationError}
      newPlaylistName={newPlaylistName}
      playlists={playlists}
      onCreatePlaylist={handleCreatePlaylist}
      onDeletePlaylist={deletePlaylist}
      onNameChange={handleNameChange}
      onOpenPlaylist={setSelectedPlaylistId}
    />
  );
};

export default PlaylistBrowser;
