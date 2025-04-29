import { client } from "@/sanity/lib/client";
import PostCard, { PostCardType } from "../../components/PostCard";
import CreatePost from "@/components/CreatePost";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const allPosts: PostCardType[] = await client
    .withConfig({ useCdn: false })
    .fetch(ALL_POSTS_QUERY);

  return (
    <>
      <section>
        <h1>Home</h1>
        <p>Welcome to your new site.</p>
      </section>
      <CreatePost />
      <section className="flex flex-col items-center p-4">
        {allPosts.map((post) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </section>
    </>
  );
}
