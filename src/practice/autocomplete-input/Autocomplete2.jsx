import { useEffect, useState } from "react";

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const [suggestions, setSuggestions] = useState([]);
  const [activeItem, setActiveItem] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery.length) {
      setSuggestions([]);
      setActiveItem(-1);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setActiveItem(-1);

        const response = await fetch(`www.sample.com/${debouncedQuery}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Invalid response");
        }

        const data = await response.json();
        setSuggestions(data.results || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();
    return () => controller.abort();
  }, [debouncedQuery]);

  const selectSuggestion = (item) => {
    setQuery(item.label);
    setSuggestions([]);
    setActiveItem(-1);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) {
      setActiveItem(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      setActiveItem((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveItem((prev) =>
        prev - 1 <= -1 ? suggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      if (activeItem > -1) selectSuggestion(suggestions[activeItem]);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {loading ? <div>...loading</div> : null}
      {error ? <div>{error.message}</div> : null}

      {suggestions.length ? (
        <ul>
          {suggestions.map((suggestion, index) => {
            return (
              <li
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                style={{
                  backgroundColor: index === activeItem ? "skyblue" : "white",
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
