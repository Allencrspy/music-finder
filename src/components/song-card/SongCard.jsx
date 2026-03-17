import "./SongCard.css";
import { useFavorites } from "../../context/FavoritesProvider";
import { useNowPlaying } from "../../context/NowPlayingProvider";
import { getHighResArtwork } from "../../utils/imageUtils";
import { useRecentlyPlayed } from "../../context/RecentlyPlayedProvider";

const SongCard = ({ song }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { setCurrentSong } = useNowPlaying();
  const { addRecentSong } = useRecentlyPlayed();

  const favorite = isFavorite(song.trackId);

  const handleFavorite = (e) => {
    e.stopPropagation(); // prevents triggering play

    if (favorite) {
      removeFavorite(song.trackId);
    } else {
      addFavorite(song);
    }
  };

  const handleClick = () => {
    setCurrentSong(song);
    addRecentSong(song);
  };

  return (
    <div className="song-card" onClick={handleClick}>
      <div className="song-artwork-wrapper">
        <img
          className="song-artwork"
          src={getHighResArtwork(song.artworkUrl100)}
          alt={song.trackName}
        />

        <div className="play-overlay">▶</div>

        <button
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={handleFavorite}
        >
          ♥
        </button>
      </div>

      <div className="song-info">
        <p className="song-title">{song.trackName}</p>
        <p className="song-artist">{song.artistName}</p>
      </div>
    </div>
  );
};

export default SongCard;
