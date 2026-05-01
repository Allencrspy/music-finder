import useRecentlyPlayedStore from "../../stores/useRecentlyPlayedStore";
import { getHighResArtwork } from "../../utils/imageUtils";
import { usePlaySong } from "../../hooks/usePlaySong";
import "./RecentlyPlayedList.css";

const RecentlyPlayedList = () => {
  const recentSongs = useRecentlyPlayedStore((s) => s.recentSongs);
  const playSong = usePlaySong();

  if (!recentSongs.length) return null;

  return (
    <div className="recently-played-container">
      <h3>Recently Played</h3>

      <div className="recently-played-list">
        {recentSongs.map((song) => (
          <div
            key={song.trackId}
            className="recent-item"
            onClick={() => playSong(song)}
          >
            <img
              src={getHighResArtwork(song.artworkUrl100)}
              alt={song.trackName}
              className="recent-art"
            />

            <div className="recent-text">
              <div className="recent-title">{song.trackName}</div>
              <div className="recent-artist">{song.artistName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayedList;
