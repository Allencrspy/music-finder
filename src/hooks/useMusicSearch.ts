import { useState } from "react";
import { searchMusic } from "../services/musicService";

const useMusicSearch = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const search = async (query) => {
    if (!query || query === currentQuery) return;

    setLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      const results = await searchMusic(query);
      setSongs(results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch songs");
    }

    setLoading(false);
  };

  return {
    songs,
    loading,
    error,
    search,
  };
};

export default useMusicSearch;
