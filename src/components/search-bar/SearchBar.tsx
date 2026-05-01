import searchIcon from "../../assets/search.svg";
import Input from "../ui/Input";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onFocus: () => void;
  onSearch: () => void;
}

const SearchBar = ({ query, setQuery, onFocus, onSearch }: SearchBarProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <Input
      icon={<img src={searchIcon} alt="Search" style={{width: '100%', height: '100%', opacity: 0.8}} />}
      value={query}
      onChange={handleInputChange}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      placeholder="Search songs or artists..."
    />
  );
};

export default SearchBar;
