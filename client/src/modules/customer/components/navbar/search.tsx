import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import AppRoutes from "../../../../common/appRoutes";

const Search = ({
  searchOpen,
  setSearchOpen,
}: {
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleClear = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(
        AppRoutes.products + `?query=${encodeURIComponent(searchQuery)}`
      );
      handleClear();
    }
  };

  return (
    <div className="flex items-center lg:ml-6">
      {searchOpen ? (
        <div className="relative">
          <input
            type="text"
            placeholder="What are you looking for ?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border border-gray-300 text-sm rounded-md outline-none focus:outline-none w-[300px] transition-all duration-700"
          />
          <button
            onClick={handleClear}
            className="absolute right-0 top-0 mt-2 mr-2 text-gray-700 hover:text-gray-500"
          >
            <Close className="text-[16px]" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 text-gray-400 hover:text-gray-500"
        >
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Search;
