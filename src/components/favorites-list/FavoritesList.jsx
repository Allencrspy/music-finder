import { useFavorites } from "../../context/FavoritesProvider";
import { useNowPlaying } from "../../context/NowPlayingProvider";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./FavoritesList.css";

const FavoritesList = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { setCurrentSong } = useNowPlaying();

  if (!favorites.length) {
    return <div className="favorites-empty">No favorites yet</div>;
  }

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("favorites");

    const downloads = favorites.map(async (song) => {
      try {
        const response = await fetch(song.previewUrl);
        const blob = await response.blob();

        const safeName = song.trackName.replace(/[^\w\s]/gi, "");

        folder.file(`${safeName}.m4a`, blob);
      } catch (err) {
        console.error("Failed to download:", song.trackName);
      }
    });

    await Promise.all(downloads);

    const content = await zip.generateAsync({ type: "blob" });

    saveAs(content, "favorites.zip");
  };

  return (
    <div className="favorites-container">
      <button className="favorites-download-all" onClick={downloadAll}>
        Download All
      </button>

      {favorites.map((song) => (
        <div
          key={song.trackId}
          className="favorite-item"
          onClick={() => setCurrentSong(song)}
        >
          <img
            src={song.artworkUrl60}
            alt={song.trackName}
            className="favorite-art"
          />

          <div className="favorite-text">
            <div className="favorite-title">{song.trackName}</div>
            <div className="favorite-artist">{song.artistName}</div>
          </div>

          <button
            className="favorite-remove-btn"
            onClick={(e) => handleRemove(e, song.trackId)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
