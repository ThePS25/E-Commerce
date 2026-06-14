import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.scss';

const SearchBar = ({ compact = false, placeholder = 'Search pet products...' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      className={`search-bar ${compact ? 'search-bar--compact' : ''}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <FiSearch className="search-bar__icon" aria-hidden />
      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search products"
      />
      <button type="submit" className="search-bar__btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
