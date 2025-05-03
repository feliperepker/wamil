import { auth, signOut, signIn } from "@/auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();

  return (
    <header>
      <nav className="flex justify-between items-center p-4 bg-black shadow-lg border-b border-y-black-100">
        <Link href="/">
          <img src="./wamil-logo.png" alt="" className="max-w-24" />
        </Link>

        <div>
          {session && session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit">Logout</button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
