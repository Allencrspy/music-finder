/**
 * An autocomplete (typeahead) input that fetches suggestions as the user types
 */

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
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery.length) {
      setActiveIndex(-1);
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setActiveIndex(-1);

        const res = await fetch(`api.com/${debouncedQuery}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();
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
    setActiveIndex(-1);
  };

  const handleKeyPress = (e) => {
    if (!suggestions.length) {
      setActiveIndex(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      if (activeIndex > -1) {
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={handleKeyPress}
      />
      {loading && <div>...Loading</div>}
      {error && <div>{error.message}</div>}
      {!loading && !suggestions.length && query && <div>No Results Found</div>}

      {suggestions?.length ? (
        <ul>
          {suggestions.map((suggestion, index) => {
            return (
              <li
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                style={{ background: index === activeIndex ? "blue" : "white" }}
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
