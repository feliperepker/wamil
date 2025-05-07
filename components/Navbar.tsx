import { auth, signIn } from "@/auth";
import Link from "next/link";
import ProfileNavbar from "./ProfileNavbar";
import { Github } from "lucide-react";
import SearchUser from "./SearchUser";

const Navbar = async () => {
  const session = await auth();

  return (
    <header>
      <nav className="flex justify-between items-center p-4 bg-black shadow-lg border-b border-y-black-100">
        <Link href="/">
          <img src="/wamil-logo.png" alt="" className="max-w-24" />
        </Link>

        <div className="flex items-center gap-4">
          <SearchUser />
          {session && session?.user ? (
            <ProfileNavbar />
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button
                className="font-oxanium flex items-center gap-2 rounded border-[1px] font-medium transition-all duration-500 text-sm text-gray-300 p-2 hover:bg-[#454545ab]"
                type="submit"
              >
                <p>Login with Github</p> <Github size={16} />
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
