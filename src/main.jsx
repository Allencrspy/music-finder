import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { NowPlayingProvider } from "./context/NowPlayingProvider.jsx";
import { RecentlyPlayedProvider } from "./context/RecentlyPlayedProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FavoritesProvider>
      <NowPlayingProvider>
        <RecentlyPlayedProvider>
          <App />
        </RecentlyPlayedProvider>
      </NowPlayingProvider>
    </FavoritesProvider>
  </StrictMode>,
);
