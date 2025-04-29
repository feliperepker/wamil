import { formatDate } from "@/lib/utils";
import { Reply, ThumbsUp } from "lucide-react";
import { Comment, User } from "@/sanity/types";
import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import InteractiveIcon from "./InteractiveIcon";

export type CommentType = Omit<
  Comment,
  "user" | "parentComments" | "totalReplies"
> & {
  user?: User;
  totalReplies?: number;
};

const CommentViewer = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [seeReply, setSeeReply] = useState<boolean>(false);

  const [parentComments, setParentComments] = useState<CommentType[]>([]);

  useEffect(() => {
    setComments([
      {
        _id: "comment123",
        _type: "comment",
        _createdAt: "2025-02-23T14:00:00Z",
        _updatedAt: "2025-02-23T14:30:00Z",
        _rev: "r1",
        comment: "Este é um comentário de teste.",
        post: {
          _type: "reference",
          _ref: "post456",
        },
        likes: [{ _ref: "user789", _type: "reference", _key: "like1" }],
        user: {
          _id: "user123",
          _type: "user",
          _createdAt: "2023-01-15T09:30:00Z",
          _updatedAt: "2025-02-20T12:00:00Z",
          _rev: "r1",
          name: "Carlos Silva",
          username: "carlosjs",
          email: "carlos.silva@email.com",
          image: "https://placehold.co/68x68",
          bio: "Desenvolvedor Front-end apaixonado por JavaScript e novas tecnologias.",
        },
        totalReplies: 1,
      },
    ]);
  }, []);

  const openCommentsReply = () => {
    setSeeReply(!seeReply);

    setParentComments([
      ...parentComments,
      {
        _id: "comment456",
        _type: "comment",
        _createdAt: "2025-02-22T10:15:00Z",
        _updatedAt: "2025-02-22T10:45:00Z",
        _rev: "r1",
        comment: "Comentário pai deste comentário.",
        likes: [{ _ref: "user789", _type: "reference", _key: "like1" }],
        post: {
          _type: "reference",
          _ref: "post456",
        },
        user: {
          _id: "user789",
          _type: "user",
          _createdAt: "2024-03-12T08:20:00Z",
          _updatedAt: "2025-02-19T17:00:00Z",
          _rev: "r2",
          name: "Ana Souza",
          username: "anasouza",
          email: "ana.souza@email.com",
          image: "https://placehold.co/68x68",
          bio: "Engenheira de software entusiasta de IA.",
        },
      },
    ]);
  };

  const replyComment = () => {};

  return (
    <>
      {comments.length > 0 ? (
        comments.map((comment) => {
          return (
            <div className="mt-2" key={comment._id}>
              <div className="flex gap-2">
                <img
                  src={comment.user?.image}
                  alt="user image"
                  className="rounded-full w-8 h-8"
                />
                <div>
                  <div className="leading-none flex gap-1 font-oxanium">
                    <p className="text-sm text-gray-300">
                      @{comment.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment._createdAt)}
                    </p>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 group">
                  <InteractiveIcon icon={ThumbsUp} />
                  <span className="text-sm font-oxanium">
                    {comment.likes?.length}
                  </span>
                </button>
                <button
                  onClick={openCommentsReply}
                  className="flex items-center gap-1 group"
                >
                  <InteractiveIcon icon={Reply} />
                  <span className="text-sm font-oxanium">
                    {comment.totalReplies}
                  </span>
                </button>
              </div>
              {seeReply && (
                <div className="ml-10 mt-2">
                  {parentComments.length > 0 &&
                    parentComments.map((parentComment) => {
                      return (
                        <ParentComments
                          key={parentComment._id}
                          commentObject={parentComment}
                        />
                      );
                    })}
                  <CommentInput
                    sendComment={replyComment}
                    hSize={56}
                    placeholder="Write a reply"
                  />
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No comments yet, why not be the first?</p>
      )}
    </>
  );
};

const ParentComments = ({ commentObject }: { commentObject: CommentType }) => {
  const {
    comment,
    user: { image, username } = {},
    _createdAt,
    likes,
  } = commentObject;

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <img src={image} alt="user image" className="rounded-full w-8 h-8" />
        <div>
          <div className="leading-none flex gap-1 font-oxanium">
            <p className="text-sm text-gray-300">@{username}</p>
            <p className="text-sm text-gray-500">{formatDate(_createdAt)}</p>
          </div>
          <p>{comment}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 group">
          <InteractiveIcon icon={ThumbsUp} />
          <span className="text-sm font-oxanium">{likes?.length}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentViewer;
