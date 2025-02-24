"use client"; // Next.js usa "use client" para interações no frontend
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

export type PostCardType = Omit<Post, "author" | "category" | "totalComments"> & {
    author?: User;
    category?: Category;
    totalComments?: number;
};

export type CommentType = Omit<Comment, "user"> & {
    user?: User;
};

const PostCard = ({ post }: { post: PostCardType }) => {
    const [selectedPost, setSelectedPost] = useState<PostCardType | null>(null);

    const openPost = () => setSelectedPost(post);
    const closePost = () => setSelectedPost(null);

    const parsedContent = md.render(post?.post || "");

    return (
        <>
            <div className="relative bg-black w-full min-w-[300px] max-w-[450px] py-6 px-5 rounded-lg shadow-lg transition-all duration-500 hover:shadow-sm hover:shadow-black-100 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#29BBF0]/5 to-[#F09029]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-lg pointer-events-none"></div>
                <div className="flex-between">
                    <p className="font-oxanium px-2 py-1 text-sm font-extralight rounded bg-black-100">
                        {formatDate(post?._createdAt)}
                    </p>
                    <div className="flex-between gap-2">
                        <div className="flex items-center space-x-1">
                            <ThumbsUp className="size-4 items-center text-primary" />
                            <span className="text-xs font-oxanium">{post?.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageCircle className="size-4 items-center text-primary" />
                            <span className="text-xs font-oxanium">{post?.totalComments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <EyeIcon className="size-4 text-primary" />
                            <span className="text-xs font-oxanium">{post?.views}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-between mt-3 font-oxanium">
                    <div>
                        <p className="font-oxanium text-sm font-extralight">{post?.author?.name}</p>
                        <h3 className="line-clamp-1 font-bold text-xl max-w-[98%]">{post?.title}</h3>
                    </div>
                    <div>
                        <img src={post?.author?.image} alt="user icon" className="rounded-full" />
                    </div>
                </div>
                <div className="divider"></div>

                {parsedContent ? (
                    <article
                        className="prose prose-invert break-words line-clamp-6 text-base"
                        dangerouslySetInnerHTML={{ __html: parsedContent }}
                    />
                ) : (
                    <p className="no-result">No details provided</p>
                )}

                <div className="mt-6 flex justify-between items-end">
                    <p className="font-oxanium text-sm">{post.category?.category}</p>

                    <Button className="btn-secondary" onClick={openPost}>
                        Read more
                    </Button>
                </div>
            </div>

            {selectedPost && <PostViewer post={selectedPost} onClose={closePost} />}
        </>
    );
};


export default PostCard;
