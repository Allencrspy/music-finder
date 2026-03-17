import { useRecentlyPlayed } from "../../context/RecentlyPlayedProvider";
import { useNowPlaying } from "../../context/NowPlayingProvider";
import { getHighResArtwork } from "../../utils/imageUtils";
import "./RecentlyPlayedList.css";

const RecentlyPlayedList = () => {
  const { recentSongs } = useRecentlyPlayed();
  const { setCurrentSong } = useNowPlaying();

  if (!recentSongs.length) return null;

  return (
    <div className="recently-played-container">
      <h3>Recently Played</h3>

      <div className="recently-played-list">
        {recentSongs.map((song) => (
          <div
            key={song.trackId}
            className="recent-item"
            onClick={() => setCurrentSong(song)}
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
