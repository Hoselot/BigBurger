import { useState } from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="w-1/2 p-5">
      <label htmlFor="search-input" className="text-black text-sm font-medium">
        Buscá tu Favorita
      </label>
      <div className="flex items-center bg-blue-200 rounded-lg px-3 py-2 mt-2 focus-within:ring-2 focus-within:ring-blue-500">
        <CiSearch className="text-black text-xl mr-2" />
        <input
          id="search-input"
          type="text"
          className="bg-transparent outline-none w-full text-black placeholder-gray-500"
          placeholder="Escribe aquí..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
