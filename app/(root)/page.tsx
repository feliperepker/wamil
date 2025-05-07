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
        <section className="w-full font-oxanium p-4 pb-0">
          <p className="text-gray-400 text-lg ">
            What are <span className="text-primary">you</span> learning today?
          </p>
        </section>
      )}

      <div className="ml-4 flex mt-4">
        <SearchForm />
        {session && session?.user && <CreatePost />}
      </div>
      <section
        id="posts-cards"
        className="flex flex-wrap items-center p-4 gap-4 max-sm:justify-center mx-auto"
      >
        {allPosts.map((post: PostCardType) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </section>
      <SanityLive />
    </>
  );
}
