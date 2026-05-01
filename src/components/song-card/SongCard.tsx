import { useEffect, useRef, useState, memo } from "react";
import { getHighResArtwork } from "../../utils/imageUtils";
import { useSongInteraction } from "../../hooks/useSongInteraction";
import PlaylistMenu from "./PlaylistMenu";
import SongCardActions from "./SongCardActions";
import Waveform from "./Waveform";
import type { Song } from "../../types/appTypes";
import "./SongCard.css";

interface SongCardProps {
  song: Song;
  onChoosePlaylist?: (song: Song) => void;
  onRemove?: (song: Song) => void;
}

const SongCard = memo(({ song, onChoosePlaylist, onRemove }: SongCardProps) => {
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const playlistMenuRef = useRef<HTMLDivElement>(null);

  const {
    favorite,
    nowPlaying,
    showWaveform,
    playlists,
    isSongInPlaylist,
    toggleFavorite,
    togglePlaylist,
    playSong,
    downloadSong,
  } = useSongInteraction(song);

  useEffect(() => {
    if (!showPlaylistMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (!playlistMenuRef.current?.contains(e.target as Node)) {
        setShowPlaylistMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showPlaylistMenu]);

  const handlePlaylistAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlaylistMenu(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(song);
  };

  return (
    <div className={`song-card ${nowPlaying ? "now-playing" : ""}`} onClick={playSong}>
      <div className="song-artwork-wrapper" ref={playlistMenuRef}>
        <img
          className="song-artwork"
          src={getHighResArtwork(song.artworkUrl100)}
          alt={song.trackName}
        />
        <div className="play-overlay">▶</div>
        
        <SongCardActions
          favorite={favorite}
          onFavorite={toggleFavorite}
          onPlaylistAction={!onRemove ? handlePlaylistAction : undefined}
          onRemove={onRemove ? handleRemove : undefined}
          onDownload={downloadSong}
        />

        {showPlaylistMenu && (
          <PlaylistMenu
            playlists={playlists}
            song={song}
            isSongInPlaylist={isSongInPlaylist}
            onChoosePlaylist={onChoosePlaylist}
            onTogglePlaylist={togglePlaylist}
            onClose={() => setShowPlaylistMenu(false)}
          />
        )}
      </div>

      <div className="song-info">
        <div className="song-title-row">
          <p className="song-title">{song.trackName}</p>
          {nowPlaying && <Waveform isVisible={showWaveform} />}
        </div>
        <p className="song-artist">{song.artistName}</p>
      </div>
    </div>
  );
});

export default SongCard;
