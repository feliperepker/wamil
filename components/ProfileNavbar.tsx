"use client";

import { getUserIdAction } from "@/lib/actions";
import { client } from "@/sanity/lib/client";
import { USER_INFOS_QUERY } from "@/sanity/lib/queries";
import { User } from "@/sanity/types";
import { useEffect, useRef, useState } from "react";
import OptionsProfileNavbar from "./OptionsProfileNavbar";

const ProfileNavbar = () => {
  const [userInfo, setUserInfo] = useState<User>();
  const [openOptions, setOpenOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Ref para capturar clique fora

  useEffect(() => {
    const getUserInfos = async () => {
      const userCall = await getUserIdAction();
      const userInfoCall = await client.fetch(USER_INFOS_QUERY, {
        userId: userCall,
      });
      setUserInfo(userInfoCall);
    };

    getUserInfos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenOptions(false);
      }
    };

    if (openOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openOptions]);

  return (
    <div
      className="flex items-center justify-center relative"
      ref={containerRef}
    >
      {userInfo && (
        <button
          onClick={() => setOpenOptions(!openOptions)}
          className="w-10 h-10 rounded-full"
        >
          <div className="relative w-10 h-10 group rounded-full overflow-hidden">
            <img
              src={userInfo.image}
              alt=""
              className="w-10 h-10 object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
          </div>
        </button>
      )}
      {openOptions && <OptionsProfileNavbar userInfo={userInfo} />}
    </div>
  );
};

export default ProfileNavbar;
