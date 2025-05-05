import PostCard, { PostCardType } from "../../components/PostCard";
import CreatePost from "@/components/CreatePost";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import SearchForm from "@/components/SearchForm";
import { auth, signIn } from "@/auth";
import About from "@/components/About";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await auth();

  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: allPosts } = await sanityFetch({
    query: ALL_POSTS_QUERY,
    params,
  });

  return (
    <>
      {!session ? (
        <About />
      ) : (
        <section className="w-full p-4 pt-10 flex-col flex items-center justify-center">
          <h1 className="font-oxanium text-5xl drop-shadow-lg">
            Welcome to Wam<span className="text-primary">i</span>l
          </h1>
          <p className="text-gray-300 mb-2">
            What are <span className="text-primary">you</span> learning today?
          </p>
        </section>
      )}

      <div className="mt-4 ml-4 flex">
        <SearchForm />
        {session && session?.user && <CreatePost />}
      </div>
      <section
        id="posts-cards"
        className="flex flex-wrap items-center p-4 gap-4"
      >
        {allPosts.map((post: PostCardType) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </section>
      <SanityLive />
    </>
  );
}
