"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchUser = () => {
  const [queryUser, setQueryUser] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleReset = () => {};
  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        name="query"
        placeholder="Search for users..."
        className="bg-black border w-52 border-black-100 rounded-md p-2 pr-16 focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
      {queryUser && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute inset-y-0 right-8 flex items-center text-gray-400"
        >
          <X className="size-5" />
        </button>
      )}
      <button
        type="submit"
        className="absolute inset-y-0 right-2 flex items-center text-gray-400"
      >
        <Search className="size-5" />
      </button>
    </form>
  );
};

export default SearchUser;
