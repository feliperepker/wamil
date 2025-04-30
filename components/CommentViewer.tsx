import { formatDate } from "@/lib/utils";
import { Reply, ThumbsUp, X } from "lucide-react";
import { Comment, User } from "@/sanity/types";
import { RefObject, useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import InteractiveIcon from "./InteractiveIcon";
import { client } from "@/sanity/lib/client";
import { REPLYES_ON_COMMENTS_QUERY } from "@/sanity/lib/queries";
import {
  addLikeAction,
  createReplyAction,
  deleteCommentAction,
  editCommentAction,
  getUserIdAction,
  removeLikeAction,
} from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export type CommentType = Omit<
  Comment,
  "user" | "parentComments" | "totalReplies"
> & {
  user?: User;
  totalReplies?: number;
  userLiked?: boolean;
};

const CommentViewer = ({
  setTotalComments,
  totalComments,
  initialComment,
  getComments,
}: {
  setTotalComments: (totalComment: number) => void;
  totalComments: number;
  initialComment: CommentType;
  getComments: () => void;
}) => {
  const [comment, setComment] = useState<CommentType>();
  const [seeReply, setSeeReply] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<boolean>(false);
  const [likesState, setLikesState] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();
  const [parentComments, setParentComments] = useState<CommentType[]>([]);

  const getUserCall = async () => {
    var userCall = await getUserIdAction();
    if (typeof userCall === "string") {
      setUserId(userCall);
    }
  };

  useEffect(() => {
    getUserCall();

    setComment(initialComment);
    setLikesState(initialComment?.likes?.length ?? 0);
    setUserLiked(initialComment?.userLiked ?? false);
  }, [initialComment]);

  const openCommentsReply = async (newSeeReply: boolean) => {
    setSeeReply(newSeeReply);

    if (newSeeReply) {
      const parentCommentsCall = await client.fetch(REPLYES_ON_COMMENTS_QUERY, {
        commentId: comment?._id,
        userId,
      });

      setParentComments(parentCommentsCall ?? []);
    }
  };

  const handleDeleteComment = async () => {
    try {
      setLoadingAction(true);
      if (!comment) return;
      const result = await deleteCommentAction(comment._id);
      if (result.status === "SUCCESS") {
        setTotalComments(totalComments - 1);
        getComments();
        toast({
          title: "Success",
          description: "Your comment has been deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLikeComment = async () => {
    try {
      let result;
      if (!comment) return;
      if (typeof userId !== "string") {
        alert("Not signed in");
      } else {
        if (userLiked) {
          result = await removeLikeAction(comment._id);
          setLikesState(likesState - 1);
          setUserLiked(false);
        } else {
          result = await addLikeAction(comment._id);
          setLikesState(likesState + 1);
          setUserLiked(true);
        }
      }
      return result;
    } catch (error) {
      console.error("Error while trying to handle likes:", error);
      return { status: "ERROR", error };
    }
  };

  const replyComment = async (
    textareaRef: RefObject<HTMLTextAreaElement | null>
  ) => {
    try {
      setLoadingComment(true);

      const commentText = textareaRef.current?.value;

      if (commentText && comment) {
        const result = await createReplyAction(commentText, comment?._id);

        if (result.status === "SUCCESS") {
          openCommentsReply(true);

          toast({
            title: "Success",
            description: "Your comment has been created successfully",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please, fill the comment before sending",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingComment(false);
      getComments();
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };

  const handleEditComment = async (
    textareaRef: RefObject<HTMLTextAreaElement | null>
  ) => {
    try {
      setLoadingComment(true);
      const commentText = textareaRef.current?.value;

      if (commentText && comment) {
        const result = await editCommentAction(commentText, comment?._id);

        if (result.status === "SUCCESS") {
          openCommentsReply(true);

          toast({
            title: "Success",
            description: "Your comment has been edited successfully",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please, fill the comment before sending",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingComment(false);
      getComments();
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setEditComment(false);
    }
  };

  return (
    <div className="mt-2" key={comment?._id}>
      <div className="flex gap-2">
        <img
          src={comment?.user?.image}
          alt="user image"
          className="rounded-full w-8 h-8"
        />
        <div className="w-full">
          <div className="leading-none flex items-center gap-1 font-oxanium">
            <p className="text-sm text-gray-300">@{comment?.user?.username}</p>
            <p className="text-sm text-gray-500">
              {formatDate(comment?._createdAt || "")}
            </p>
            {comment?.user?._id == userId && (
              <div className="flex gap-1 ml-1">
                <button
                  disabled={loadingAction}
                  onClick={() => {
                    setEditComment(!editComment);
                  }}
                  className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                >
                  Edit
                </button>
                <button
                  disabled={loadingAction}
                  onClick={() => {
                    handleDeleteComment();
                  }}
                  className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {editComment ? (
            <CommentInput
              sendComment={handleEditComment}
              comment={comment}
              hSize={56}
              placeholder="Edit your comment"
              loadingComment={loadingComment}
              starterComment={comment?.comment}
            />
          ) : (
            <p>{comment?.comment}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            handleLikeComment();
          }}
          className="flex items-center gap-1 group"
        >
          <InteractiveIcon filled={userLiked} icon={ThumbsUp} />
          <span className="text-sm font-oxanium">{likesState}</span>
        </button>
        <button
          onClick={() => {
            openCommentsReply(!seeReply);
          }}
          className="flex items-center gap-1 group"
        >
          <InteractiveIcon filled={seeReply} icon={Reply} />
          <span className="text-sm font-oxanium">
            {comment?.totalReplies ?? 0}
          </span>
        </button>
      </div>
      {seeReply && (
        <div className="ml-10 mt-2">
          <CommentInput
            sendComment={replyComment}
            comment={comment}
            hSize={56}
            placeholder="Write a reply"
            loadingComment={loadingComment}
          />
          {parentComments.length > 0 &&
            parentComments.map((parentComment) => {
              return (
                <ParentComments
                  key={parentComment._id}
                  commentObject={parentComment}
                  getComments={getComments}
                  userId={userId}
                  openCommentsReply={openCommentsReply}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

const ParentComments = ({
  commentObject,
  getComments,
  userId,
  openCommentsReply,
}: {
  commentObject: CommentType;
  getComments: () => void;
  userId: string;
  openCommentsReply: (newSeeReply: boolean) => void;
}) => {
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const { toast } = useToast();
  const [likesState, setLikesState] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);

  const { _id, comment, user, _createdAt, likes } = commentObject;

  const handleDeleteParentComment = async () => {
    try {
      setLoadingDelete(true);
      if (!comment) return;
      const result = await deleteCommentAction(_id);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your comment has been deleted successfully",
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
      openCommentsReply(true);
      getComments();
    }
  };

  const handleLikeParentComment = async () => {
    try {
      let result;
      if (!comment) return;
      if (typeof userId !== "string") {
        alert("Not signed in");
      } else {
        if (userLiked) {
          result = await removeLikeAction(_id);

          setUserLiked(false);
          setLikesState(likesState - 1);
        } else {
          result = await addLikeAction(_id);

          setUserLiked(true);
          setLikesState(likesState + 1);
        }
      }
      return result;
    } catch (error) {
      console.error("Error while trying to handle likes:", error);
      return { status: "ERROR", error };
    }
  };

  const handleEditComment = async (
    textareaRef: RefObject<HTMLTextAreaElement | null>
  ) => {
    try {
      setLoadingComment(true);
      const commentText = textareaRef.current?.value;

      if (commentText && comment) {
        const result = await editCommentAction(commentText, _id);

        if (result.status === "SUCCESS") {
          openCommentsReply(true);

          toast({
            title: "Success",
            description: "Your comment has been edited successfully",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please, fill the comment before sending",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingComment(false);
      getComments();
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setEditComment(false);
    }
  };

  useEffect(() => {
    setLikesState(likes?.length ?? 0);
    setUserLiked(likes?.some((like) => like._ref === userId) ?? false);
  }, []);

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <img
          src={user?.image}
          alt="user image"
          className="rounded-full w-8 h-8"
        />
        <div className="w-full">
          <div className="leading-none flex gap-1 font-oxanium">
            <p className="text-sm text-gray-300">@{user?.username}</p>
            <p className="text-sm text-gray-500">{formatDate(_createdAt)}</p>
            {user?._id == userId && (
              <div className="flex gap-1 ml-1">
                <button
                  disabled={loadingDelete}
                  onClick={() => {
                    setEditComment(!editComment);
                  }}
                  className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                >
                  Edit
                </button>
                <button
                  disabled={loadingDelete}
                  onClick={() => {
                    handleDeleteParentComment();
                  }}
                  className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {editComment ? (
            <CommentInput
              sendComment={handleEditComment}
              hSize={56}
              placeholder="Edit your comment"
              loadingComment={loadingComment}
              starterComment={comment}
            />
          ) : (
            <p>{comment}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            handleLikeParentComment();
          }}
          className="flex items-center gap-1 group"
        >
          <InteractiveIcon filled={userLiked} icon={ThumbsUp} />
          <span className="text-sm font-oxanium">{likesState}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentViewer;
