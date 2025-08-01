import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full mb-2">
      <input
        type="text"
        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring focus:border-blue-400"
        placeholder={placeholder || 'Rechercher...'}
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
