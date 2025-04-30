import { formatDate } from "@/lib/utils";
import { Reply, ThumbsUp, X } from "lucide-react";
import { Comment, User } from "@/sanity/types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import CommentInput from "./CommentInput";
import InteractiveIcon from "./InteractiveIcon";
import { client } from "@/sanity/lib/client";
import { COMMENTS_ON_POSTS_QUERY } from "@/sanity/lib/queries";
import { addLike, deleteComment, getUserId, removeLike } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export type CommentType = Omit<
  Comment,
  "user" | "parentComments" | "totalReplies"
> & {
  user?: User;
  totalReplies?: number;
  userLiked?: boolean;
};

export type CommentViewerHandle = {
  getComments: () => void;
};
const CommentViewer = forwardRef<
  CommentViewerHandle,
  {
    postId: string;
    totalComments: number;
    setTotalComments: (totalComments: number) => void;
  }
>(({ postId, setTotalComments, totalComments }, ref) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [seeReply, setSeeReply] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();

  const [parentComments, setParentComments] = useState<CommentType[]>([]);

  const getComments = async () => {
    const comments = await client.fetch(COMMENTS_ON_POSTS_QUERY, {
      postId,
      userId,
    });
    setComments(comments ?? []);
  };

  useImperativeHandle(ref, () => ({
    getComments,
  }));

  const getUserCall = async () => {
    var userCall = await getUserId();
    if (typeof userCall === "string") {
      setUserId(userCall);
      getComments();
    }
  };
  useEffect(() => {
    getUserCall();
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

  const handleDeleteComment = async (comment: CommentType) => {
    try {
      setLoadingDelete(true);
      const result = await deleteComment(comment._id);
      if (result.status === "SUCCESS") {
        setTotalComments(totalComments - 1);
        getComments();
        toast({
          title: "Success",
          description: "Your comment has been created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleLikeComment = async (comment: CommentType) => {
    try {
      let result;
      const commentsArray = [...comments];
      const localLikes = comment.likes ?? [];
      const commentState = commentsArray.find((c) => c._id === comment._id);

      const userLiked = localLikes.some((like) => like._ref === userId);
      if (typeof userId !== "string") {
        alert("Not signed in");
      } else {
        if (userLiked) {
          result = await removeLike(comment._id);

          commentState?.likes?.splice(
            commentState?.likes?.findIndex((l) => l._ref === userId)
          );
          if (commentState) {
            commentState.userLiked = false;
          }
        } else {
          result = await addLike(comment._id);

          commentState?.likes?.push({
            _key: userId,
            _ref: userId,
            _type: "reference",
          });
          if (commentState) {
            commentState.userLiked = true;
          }
        }
        setComments(commentsArray);
      }

      return result;
    } catch (error) {
      console.error("Error while trying to handle likes:", error);
      return { status: "ERROR", error };
    }
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
                  <div className="leading-none flex justify-between items-center gap-1 font-oxanium">
                    <p className="text-sm text-gray-300">
                      @{comment.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment._createdAt)}
                    </p>
                    {comment.user?._id == userId && (
                      <button
                        disabled={loadingDelete}
                        onClick={() => {
                          handleDeleteComment(comment);
                        }}
                      >
                        <X
                          className="ml-1 mb-1 text-gray-500 hover:text-gray-300 transition-all"
                          size={12}
                        />
                      </button>
                    )}
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleLikeComment(comment);
                  }}
                  className="flex items-center gap-1 group"
                >
                  <InteractiveIcon filled={comment.userLiked} icon={ThumbsUp} />
                  <span className="text-sm font-oxanium">
                    {comment.likes?.length ?? 0}
                  </span>
                </button>
                <button
                  onClick={openCommentsReply}
                  className="flex items-center gap-1 group"
                >
                  <InteractiveIcon icon={Reply} />
                  <span className="text-sm font-oxanium">
                    {comment.totalReplies ?? 0}
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
                    loadingComment
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
});

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
