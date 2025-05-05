import { auth, signIn } from "@/auth";
import ButtonAction from "./ButtonAction";
import GraphKnowledge from "./GraphKnowledge";

const About = async () => {
  const session = await auth();

  return (
    <>
      <section className="w-full p-4 pt-20 flex-col gap-2 flex items-center justify-center bg-black">
        <div className=" text-center">
          <h1 className="font-oxanium text-6xl drop-shadow-lg">
            What are <span className="text-primary">you</span> learning today?
          </h1>
          <p className="text-gray-300">
            Discover new things. Share what you're learning. Grow with others
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            if (session && session?.user) {
            } else {
              await signIn("github");
            }
          }}
        >
          {session && session?.user ? (
            <ButtonAction text="Start sharing now" variant="btn-secondary" />
          ) : (
            <button type="submit" className="btn-secondary">
              Start sharing now
            </button>
          )}
        </form>
      </section>
      <section className="bg-black w-full min-h-72 gap-8 flex py-10 pb-6 px-2 justify-center font-oxanium shadow-lg max-md:flex-col-reverse max-md:items-center">
        <div className="max-w-lg">
          <p className="text-gray-500 mb-2">
            What am <span className="text-primary">I</span> learning
          </p>
          <p className="text-gray-300">
            Have you seen this graph before? Everyone has a unique way of
            learning, but we tend to retain more when we teach someone else.
          </p>
          <p className="text-gray-300 mt-2">
            Here on Wamil, you can share what you're learning with anyone around
            the world—without judgment. We're all here to learn together.
          </p>
          <div className="flex items-end gap-2">
            <form
              action={async () => {
                "use server";
                if (session && session?.user) {
                } else {
                  await signIn("github");
                }
              }}
            >
              {session && session?.user ? (
                <ButtonAction text="Start sharing" variant="btn-clean" />
              ) : (
                <button type="submit" className="btn-clean">
                  Start sharing
                </button>
              )}
            </form>
            <a
              href="#posts-cards"
              className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer transition-all duration-500 underline"
            >
              See what others are posting
            </a>
          </div>
        </div>
        <GraphKnowledge />
      </section>
    </>
  );
};

export default About;
