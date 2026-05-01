import { useEffect, useState } from "react";

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeItemId, setActiveItemId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (!debouncedQuery.length) {
      setSuggestions([]);
      setActiveItemId(-1);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`www.api.com?${debouncedQuery}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("failed to fetch data");
        }

        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (error) {
        if (error.name !== "AbortError") setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [debouncedQuery]);

  const selectSuggestion = (item) => {
    setQuery(item.label);
    setSuggestions([]);
    setActiveItemId(-1);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveItemId((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveItemId((prev) =>
        prev - 1 <= 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      if (activeItemId > -1) {
        selectSuggestion(suggestions[activeItemId]);
      }
    } else if (e.key === "Escape") {
      setActiveItemId(-1);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {loading ? <div>Loading Data</div> : null}
      {error ? <div>{error.message}</div> : null}
      {query && !loading && !suggestions.length ? (
        <div>No results found</div>
      ) : null}

      {suggestions.length ? (
        <ul>
          {suggestions.map((suggestion, index) => {
            return (
              <li
                onClick={() => selectSuggestion(suggestion)}
                key={index}
                style={{
                  background: index === activeItemId ? "blue" : "white",
                }}
              >
                {suggestion.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default Autocomplete;
