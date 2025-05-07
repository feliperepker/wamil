import { auth } from "@/auth";
import PostCard, { PostCardType } from "@/components/PostCard";
import { client } from "@/sanity/lib/client";
import { POSTS_BY_USER_QUERY, USER_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(USER_BY_ID_QUERY, {
    id,
  });
  if (!user) return notFound();

  const posts = await client.fetch(POSTS_BY_USER_QUERY, {
    id: id,
  });

  return (
    <section className="flex p-8 gap-8 max-md:flex-col max-md:items-center ">
      <div className="flex flex-col items-center gap-4 p-4 h-fit font-oxanium rounded-lg min-w-56 max-sm:w-full max-md:w-[450px] shadow-lg bg-gradient-to-br from-[#29BBF0]/5 to-[#F09029]/5">
        <div className="">
          <h3 className="text-center text-gray-400 text-2xl ">{user.name}</h3>
        </div>
        <img
          className="max-w-40 min-w-20 rounded-full shadow-lg"
          src={user.image}
          alt={user.name}
        />
        <div className="text-center flex flex-col gap-2">
          <p className="text-gray-300">@{user.username}</p>
          <p>{user.bio}</p>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-oxanium text-gray-300 mb-2 text-2xl">
          {session?.id == id ? "Your" : "All"} Posts
        </h3>
        <div
          id="posts-cards"
          className="flex flex-wrap items-center gap-4 max-md:justify-center"
        >
          {posts.map((post: PostCardType) => {
            return <PostCard key={post._id} post={post} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Page;
