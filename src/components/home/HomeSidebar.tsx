import RecentlyPlayedList from "../recently-played/RecentlyPlayedList";
import SearchBar from "../search-bar/SearchBar";
import LibraryNavigation from "../navigation/LibraryNavigation";
import UserProfile from "../auth/UserProfile";
import { useState, lazy, Suspense } from "react";
import logoIcon from "../../assets/logo.svg";
import type { HomePage } from "../../types/appTypes";

const AuthModal = lazy(() => import("../auth/AuthModal"));

interface HomeSidebarProps {
  activePage: HomePage;
  onNavigate: (page: HomePage) => void;
  onSearch: () => void;
  onSearchFocus: () => void;
  query: string;
  setQuery: (query: string) => void;
}

const HomeSidebar = ({
  activePage,
  onNavigate,
  query,
  setQuery,
  onSearchFocus,
  onSearch,
}: HomeSidebarProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <aside className="home-sidebar">
      <div className="home-title">
        <img src={logoIcon} alt="Music Finder Logo" className="sidebar-logo" />
        Music Finder
      </div>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onFocus={onSearchFocus}
        onSearch={onSearch}
      />
      <LibraryNavigation activePage={activePage} onNavigate={onNavigate} />

      <RecentlyPlayedList />

      <div className="sidebar-auth">
        <UserProfile onLoginClick={() => setIsAuthModalOpen(true)} />
      </div>

      <Suspense fallback={null}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </Suspense>
    </aside>
  );
};

export default HomeSidebar;
