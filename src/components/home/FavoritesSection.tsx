import { useState, memo } from "react";
import JSZip from "jszip";
import * as FileSaver from "file-saver";
import SongGrid from "./SongGrid";
import Button from "../ui/Button";
import { type Song } from "../../types/appTypes";

interface FavoritesSectionProps {
  favorites: Song[];
  onChoosePlaylist: (song: Song) => void;
}

const FavoritesSection = memo(({ favorites, onChoosePlaylist }: FavoritesSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (!favorites.length || isDownloading) return;

    setIsDownloading(true);
    console.log("Starting ZIP generation for", favorites.length, "songs...");
    
    try {
      const zip = new JSZip();
      const folder = zip.folder("my-favorites");

      const downloadPromises = favorites.map(async (song, index) => {
        if (!song.previewUrl) return;
        try {
          const response = await fetch(song.previewUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          const fileName = `${index + 1}. ${song.trackName} - ${song.artistName}.mp3`
            .replace(/[\\/:*?"<>|]/g, "");
          
          folder?.file(fileName, blob);
          console.log(`Added to ZIP: ${song.trackName}`);
        } catch (err) {
          console.error(`Failed to download ${song.trackName}:`, err);
        }
      });

      await Promise.all(downloadPromises);
      
      const content = await zip.generateAsync({ type: "blob" });
      FileSaver.saveAs(content, "favorites-collection.zip");
      console.log("ZIP download triggered successfully.");
    } catch (error) {
      console.error("ZIP creation failed:", error);
      alert("Failed to create ZIP. Please check your connection or console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!favorites.length) {
    return (
      <div className="empty-state">
        <h2>Your heart is empty...</h2>
        <p>Save songs you love to see them here and download them for offline listening.</p>
      </div>
    );
  }

  return (
    <div className="favorites-page-container">
      <div className="section-header">
        <div className="header-left">
          <h2>Favorites</h2>
          <span className="results-count">{favorites.length} saved songs</span>
        </div>
        <div className="header-actions">
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            loading={isDownloading}
            disabled={isDownloading}
          >
            Download All as ZIP
          </Button>
        </div>
      </div>

      <div className="grid-wrapper">
        <SongGrid
          songs={favorites}
          onChoosePlaylist={onChoosePlaylist}
          skeletonKeyPrefix="fav"
        />
      </div>
    </div>
  );
});

export default FavoritesSection;
