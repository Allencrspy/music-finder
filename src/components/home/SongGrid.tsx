import SongCard from "../song-card/SongCard";
import { type Song } from "../../types/appTypes";

interface SongGridProps {
  songs: Song[];
  loading?: boolean;
  loadingMore?: boolean;
  onChoosePlaylist?: (song: Song) => void;
  onRemove?: (song: Song) => void;
  skeletonCount?: number;
  skeletonKeyPrefix?: string;
}

const SongGrid = ({
  songs,
  loading,
  loadingMore,
  onChoosePlaylist,
  onRemove,
  skeletonCount = 20,
  skeletonKeyPrefix = "skeleton",
}: SongGridProps) => {
  const renderSkeletons = (count: number, prefix: string) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={`${prefix}-${i}`} className="song-card-skeleton" />
    ));

  if (loading) {
    return (
      <div className="songs-grid">
        {renderSkeletons(skeletonCount, skeletonKeyPrefix)}
      </div>
    );
  }

  return (
    <div className="songs-grid">
      {songs.map((song) => (
        <SongCard 
          key={song.trackId} 
          song={song} 
          onChoosePlaylist={onChoosePlaylist} 
          onRemove={onRemove}
        />
      ))}
      {loadingMore && renderSkeletons(5, `${skeletonKeyPrefix}-more`)}
    </div>
  );
};

export default SongGrid;
