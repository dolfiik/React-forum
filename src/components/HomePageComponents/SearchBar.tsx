import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ( {onSearch} ) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder='Przeszukaj posty...'
      onChange={handleChange}
    />
  );
};

export default SearchBar;
