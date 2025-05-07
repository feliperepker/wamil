"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("query") || "");

  const updateURL = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(query);
  };

  const handleReset = () => {
    setQuery("");
    updateURL("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        name="query"
        placeholder="Search for posts..."
        className="bg-black border border-black-100 rounded-md p-2 pr-16 focus:outline-none focus:ring-1 focus:ring-gray-500 max-sm:w-40"
      />
      {query && (
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

export default SearchForm;
