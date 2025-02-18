import { auth, signOut, signIn } from "@/auth";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

const Navbar = async () => {
    const session = await auth();

    return <header>
        <nav>
            <Link href="/">
                <img src="" alt="" />
            </Link>

            <div>
                {session && session?.user ? (
                   <form action={async () => {
                    "use server"
                    await signOut({redirectTo: '/'})
                }}>
                    <button type="submit">
                        Logout
                    </button>
                </form>   
                ) : (
                    <form action={async () => {
                        "use server"
                        await signIn('github')
                    }}>
                        <button type="submit">
                            Login
                        </button>
                    </form>                
            )}
            </div>
        </nav>
    </header>
}

export default Navbar;