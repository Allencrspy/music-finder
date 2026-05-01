import { HOME_PAGE, type HomePage } from "../../types/appTypes";
import Button from "../ui/Button";

const tabs = [
  { id: HOME_PAGE.FAVORITES, label: "Favorites" },
  { id: HOME_PAGE.PLAYLISTS, label: "Playlists" },
] as const;

interface LibraryNavigationProps {
  activePage: HomePage;
  onNavigate: (page: HomePage) => void;
}

const LibraryNavigation = ({ activePage, onNavigate }: LibraryNavigationProps) => {
  const playlistActive =
    activePage === HOME_PAGE.PLAYLISTS || activePage === HOME_PAGE.CHOOSE_PLAYLIST;

  return (
    <div className="home-browser-tabs">
      {tabs.map((tab) => {
        const isActive =
          tab.id === HOME_PAGE.PLAYLISTS ? playlistActive : activePage === tab.id;

        return (
          <Button
            key={tab.id}
            variant="outline"
            active={isActive}
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default LibraryNavigation;
