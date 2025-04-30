"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Category, Comment, Post, User } from "@/sanity/types";
import { EyeIcon, MessageCircle, ThumbsUp } from "lucide-react";
import markdownit from "markdown-it";
import PostViewer from "./PostViewer";

const md = markdownit({
  breaks: true,
  linkify: true,
});

export type PostCardType = Omit<
  Post,
  "author" | "category" | "totalComments"
> & {
  author?: User;
  category?: Category;
  totalComments?: number;
};

export type CommentType = Omit<Comment, "user"> & {
  user?: User;
};

const PostCard = ({ post }: { post: PostCardType }) => {
  const [selectedPost, setSelectedPost] = useState<PostCardType | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(
    post?.likes?.length || 0
  );
  const [totalViews, setTotalViews] = useState<number>(
    post?.views?.length || 0
  );
  const [totalComments, setTotalComments] = useState<number>(
    post?.totalComments || 0
  );

  const openPost = () => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  const parsedContent = md.render(post?.post || "");

  return (
    <>
      <div className="relative flex flex-col bg-black w-full h-[340px]  min-w-[300px] max-w-[450px] py-6 px-5 rounded-lg shadow-lg transition-all duration-500 hover:shadow-sm hover:shadow-black-100 group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#29BBF0]/5 to-[#F09029]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-lg pointer-events-none"></div>
        <div className="flex-between">
          <p className="font-oxanium px-2 py-1 text-sm font-extralight rounded bg-black-100">
            {formatDate(post?._createdAt)}
          </p>
          <div className="flex-between gap-2">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="size-4 items-center text-primary" />
              <span className="text-xs font-oxanium">{totalLikes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="size-4 items-center text-primary" />
              <span className="text-xs font-oxanium">{totalComments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <EyeIcon className="size-4 text-primary" />
              <span className="text-xs font-oxanium">{totalViews}</span>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mt-3 font-oxanium">
          <div>
            <p className="font-oxanium text-sm font-extralight">
              {post?.author?.name}
            </p>
            <h3 className="line-clamp-1 font-bold text-xl max-w-[98%]">
              {post?.title}
            </h3>
          </div>
          <div>
            <img
              src={post?.author?.image}
              alt="user icon"
              className="size-10 rounded-full"
            />
          </div>
        </div>

        {parsedContent ? (
          <div className="bg-[#222829] rounded p-2 mt-2">
            <article
              className="prose prose-invert break-words line-clamp-3 text-xs"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          </div>
        ) : (
          <p className="no-result">No details provided</p>
        )}

        <div className="mt-auto flex justify-between items-end">
          <p className="font-oxanium text-sm">{post.category?.category}</p>

          <Button className="btn-secondary" onClick={openPost}>
            Read more
          </Button>
        </div>
      </div>

      {selectedPost && (
        <PostViewer
          post={selectedPost}
          onClose={closePost}
          setTotalLikes={setTotalLikes}
          totalLikes={totalLikes}
          setTotalViews={setTotalViews}
          totalViews={totalViews}
          totalComments={totalComments}
          setTotalComments={setTotalComments}
        />
      )}
    </>
  );
};

export default PostCard;
