"use client";

import { client } from "@/sanity/lib/client";
import { GET_USERS_QUERY } from "@/sanity/lib/queries";
import { User } from "@/sanity/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Spinner from "./Spinner";

const SearchUser = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsFocused(true);
    setLoading(true);
    const usersCall = await client.fetch(GET_USERS_QUERY, { search });
    setUsers(usersCall);
    setHasSearched(true);
    setLoading(false);
  };

  const handleReset = () => {
    setSearch("");
    setUsers([]);
    setHasSearched(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          name="query"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search for users..."
          className="bg-black border w-52 border-black-100 rounded-md p-2 pr-16 focus:outline-none focus:ring-1 focus:ring-gray-500 max-sm:w-36"
        />
        {search && (
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

      {isFocused && (
        <div className="absolute top-10 left-0 bg-black w-full rounded-md shadow-lg z-10 hover:bg-black-100 transition-all duration-500">
          {loading && <Spinner size={20} />}
          {users.length > 0 && hasSearched
            ? users.map((user) => (
                <Link
                  href={`/profile/${user._id}`}
                  className="flex gap-2 items-center p-4 w-full "
                  key={user._id}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img
                    src={user.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start">
                    <p>{user.name}</p>
                    <p className="text-gray-500 text-sm max-sm:hidden">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))
            : hasSearched && (
                <p className="m-2 text-center">
                  We couldn't find a user with this search
                </p>
              )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
