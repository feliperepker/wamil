"use client";

import { User } from "@/sanity/types";
import { signOut } from "next-auth/react";
import Link from "next/link";

const OptionsProfileNavbar = ({ userInfo }: { userInfo: User | undefined }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="absolute top-[56px] -right-4 bg-black font-oxanium flex flex-col items-center shadow-lg rounded z-10">
      <div className="p-3">
        <p className="leading-none">Hello!</p>
        <p className="leading-tight text-sm mt-1">{userInfo?.name}</p>
        <p className="text-gray-500 text-sm leading-tight">
          @{userInfo?.username}
        </p>
      </div>
      <div className="w-full h-[1px] bg-black-100"></div>
      <Link
        className="w-full h-10 flex items-center justify-center hover:bg-black-100 transition-all duration-500"
        href={`profiles/${userInfo?._id}`}
      >
        See profile
      </Link>
      <button
        className="w-full h-10 hover:bg-black-100 transition-all duration-500"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default OptionsProfileNavbar;
