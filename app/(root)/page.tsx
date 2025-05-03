import PostCard, { PostCardType } from "../../components/PostCard";
import CreatePost from "@/components/CreatePost";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import GraphKnowledge from "@/components/GraphKnowledge";

export default async function Home() {
  const { data: allPosts } = await sanityFetch({ query: ALL_POSTS_QUERY });

  return (
    <>
      <section className="w-full h-60 p-4 flex-col gap-2 flex items-center justify-center bg-gradient-to-br from-[#29BBF0]/5 to-[#F09029]/5 ">
        <div className="max-w-lg text-center">
          <h1 className="font-oxanium text-4xl">
            Welcome to Wam<span className="text-primary">i</span>l
          </h1>
          <p className="text-gray-300">
            Learn new things. Share your learning journey. Grow together.
          </p>
        </div>
        <button className="btn-primary">Share what you are learning</button>
      </section>
      <section className="bg-black w-full min-h-72 gap-8 p-4 flex items-center justify-center font-oxanium">
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
          <div className="flex items-end gap-2 ">
            <button className="btn-secondary mt-4">Start sharing</button>
            <p className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer transition-all duration-500">
              See what others are posting
            </p>
          </div>
        </div>
        <GraphKnowledge />
      </section>
      <CreatePost />
      <section className="flex flex-wrap items-center p-4 gap-4">
        {allPosts.map((post: PostCardType) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </section>
      <SanityLive />
    </>
  );
}
