import { formatDate } from "@/lib/utils";
import { Reply, ThumbsUp } from "lucide-react";
import { Comment, User } from "@/sanity/types";


export type CommentType = Omit<Comment, "user" | "parentComments" | "totalReplies"> & {
    user?: User;
    parentComments?: CommentType[];
    totalReplies?: number;
};

const CommentViewer = ({commentObject}: {commentObject: CommentType}) => {
    const { comment, user: { image, name, username } = {}, _createdAt, parentComments, likes, totalReplies } = commentObject;

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <img src={image} alt="user image" className="rounded-full w-8 h-8" />
                <div>
                    <div className="leading-none flex gap-1 font-oxanium">
                        <p className="text-sm">{username}</p>
                        <p className="text-sm text-gray-500">{formatDate(_createdAt)}</p>
                    </div>
                    <p>
                     {comment}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-1">
                    <ThumbsUp className="size-5 text-primary" />
                    <span className="text-sm font-oxanium">{likes}</span>
                </button>
                <button className="flex items-center gap-1">
                    <Reply className="size-6 text-primary" />
                    <span className="text-sm font-oxanium">{totalReplies}</span>
                </button>
            </div>           
        </div>
    ) 
}

export default CommentViewer;