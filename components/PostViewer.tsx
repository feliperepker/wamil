import { PostCardType } from "./PostCard";
import markdownit from "markdown-it";
import { RefObject, useEffect, useRef, useState } from "react";
import { EyeIcon, MessageCircle, Send, ThumbsUp, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CommentViewer, { CommentType } from "./CommentViewer";
import CommentInput from "./CommentInput";
import InteractiveIcon from "./InteractiveIcon";
import {
  addLikeAction,
  addUserViewAction,
  createCommentAction,
  deletePostAction,
  editPostAction,
  getUserIdAction,
  removeLikeAction,
} from "@/lib/actions";
import { client } from "@/sanity/lib/client";
import {
  COMMENTS_ON_POSTS_QUERY,
  VIEWS_LIKES_ON_POSTS_QUERY,
} from "@/sanity/lib/queries";
import { toast } from "@/hooks/use-toast";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import ModalAction from "./ModalAction";
import Spinner from "./Spinner";
interface ViewProps {
  _ref: string;
  _type: "reference";
  _key: string;
}

const md = markdownit({
  breaks: true,
  linkify: true,
});

const PostViewer = ({
  post,
  onClose,
  setTotalLikes,
  totalLikes,
  setTotalViews,
  totalViews,
  setTotalComments,
  totalComments,
}: {
  post: PostCardType;
  onClose: () => void;
  setTotalLikes: (likes: number) => void;
  totalLikes: number;
  setTotalViews: (views: string[]) => void;
  totalViews: string[];
  setTotalComments: (comment: number) => void;
  totalComments: number;
}) => {
  const [parsedContent, setParsedContent] = useState(
    md.render(post.post || "")
  );
  const [seeComments, setSeeComments] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [loadingCommentSection, setLoadingCommentSection] =
    useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isPendingEditing, setIsPendingEditing] = useState<boolean>(false);
  const [postEditContent, setPostEditContent] = useState<string>(
    post.post || ""
  );
  const [userId, setUserId] = useState<string>("");

  const {
    _id,
    _createdAt,
    author: { image, username, name, _id: authorId } = {},
  } = post;

  const getUserCall = async () => {
    var userCall = await getUserIdAction();
    if (typeof userCall === "string") {
      setUserId(userCall);
    }
  };

  useEffect(() => {
    getUserCall();
    const fetchPostData = async () => {
      const postData = await client.fetch(VIEWS_LIKES_ON_POSTS_QUERY, {
        id: _id,
      });
      handleUserLiked(postData);
    };
    fetchPostData();
    handleUserView();
  }, []);

  const getComments = async () => {
    setLoadingCommentSection(true);
    var userCall = await getUserIdAction();

    const commentsCall = await client.fetch(COMMENTS_ON_POSTS_QUERY, {
      postId: _id,
      userCall,
    });

    setComments(commentsCall ?? []);
    setLoadingCommentSection(false);
  };

  const openComments = () => {
    if (!seeComments) {
      getComments();
    }
    setSeeComments(!seeComments);
  };

  const handleUserView = async () => {
    const userId = await getUserIdAction();

    const userView = totalViews.includes(userId);

    if (!userView && typeof userId === "string") {
      await addUserViewAction(_id);
      setTotalViews([...totalViews, userId]);
    }
  };

  const handleUserLiked = async (postData: PostCardType) => {
    const userId = await getUserIdAction();
    const localLikes = postData.likes ?? [];

    setUserLiked(localLikes.some((like) => like._ref === userId));
  };

  const handleLike = async () => {
    try {
      let result;
      const userId = await getUserIdAction();

      if (typeof userId !== "string") {
        toast({
          title: "Oops! 😅",
          description: "You need to sign in to like this.",
        });
      } else {
        if (userLiked) {
          result = await removeLikeAction(_id);
          setTotalLikes(totalLikes - 1);
          setUserLiked(false);
        } else {
          result = await addLikeAction(_id);
          setTotalLikes(totalLikes + 1);
          setUserLiked(true);
        }
      }

      return result;
    } catch (error) {
      console.error("Error while trying to handle likes:", error);
      return { status: "ERROR", error };
    }
  };

  const writeNewComment = async (
    textareaRef: RefObject<HTMLTextAreaElement | null>
  ) => {
    try {
      if (typeof userId !== "string" || userId === "") {
        toast({
          title: "Oops! 😅",
          description: "You need to sign in to comment.",
        });
        return;
      }

      setLoadingComment(true);

      const comment = textareaRef.current?.value;

      if (comment) {
        const result = await createCommentAction(comment, _id);

        if (result.status === "SUCCESS") {
          setTotalComments(totalComments + 1);
          getComments();

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
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoadingAction(true);
      setIsPendingEditing(true);
      const result = await editPostAction(postEditContent, _id);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
        setParsedContent(md.render(postEditContent || ""));
      } else {
        toast({
          title: "Error",
          description: "An error occurred while saving the post.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while saving the post.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
      setEditPost(false);
      setIsPendingEditing(false);
    }
  };

  const cancelEditPost = () => {
    setEditPost(false);
    setPostEditContent(post.post || "");
  };

  const handleDeletePost = async () => {
    try {
      setLoadingAction(true);
      const result = await deletePostAction(_id);

      if (result) {
        toast({
          title: "Success",
          description: "Post deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while deleting the post.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the post.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#1111119f] flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black w-full overflow-y-auto max-w-3xl p-4 rounded-lg shadow-lg max-h-full"
      >
        <div className="flex justify-between items-start">
          <h2 className="font-oxanium text-xl font-semibold max-w-[90%]">
            {post.title}
          </h2>
          <button onClick={onClose}>
            <X
              width={18}
              className="hover:text-gray-600 transiton duration-500"
            />
          </button>
        </div>

        <div className="flex items-center gap-3 my-3">
          <img src={image} alt={name} className="w-8 h-8 rounded-full" />
          <div className="leading-none font-oxanium">
            <div className="flex gap-1">
              <p>{name}</p>
              <p className="text-sm text-gray-400">@{username}</p>
              {authorId == userId && (
                <div className="flex gap-1 ml-1">
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      setEditPost(!editPost);
                    }}
                    className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                  >
                    Edit
                  </button>
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      setModalDelete(!modalDelete);
                    }}
                    className=" text-gray-500 hover:text-gray-300 transition-all text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(_createdAt)}</p>
          </div>
        </div>
        {editPost ? (
          <div className="mt-4">
            <MDEditor
              value={postEditContent}
              preview="edit"
              height={300}
              onChange={(value) => setPostEditContent(value || "")}
              style={{
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#272c2e",
              }}
              textareaProps={{
                placeholder: "Edit your post content...",
              }}
              previewOptions={{
                disallowedElements: ["style"],
              }}
            />
            <div className="flex gap-2 mt-2">
              <Button
                disabled={isPendingEditing}
                className="btn-secondary self-end ml-auto"
                size="sm"
                type="submit"
                onClick={() => {
                  handleSaveEdit();
                }}
              >
                {isPendingEditing ? "Editing..." : "Edit Post"}
                <Send className="size-3 ml-1" />
              </Button>

              <Button
                disabled={isPendingEditing}
                className="btn-cancel self-end"
                size="sm"
                type="submit"
                onClick={() => {
                  cancelEditPost();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <article
            className="prose overflow-y-auto prose-invert mt-4 break-words text-base w-full max-h-[82%]"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        )}

        <div className="divider"></div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 group"
          >
            <InteractiveIcon filled={userLiked} icon={ThumbsUp} />
            <span className="text-sm font-oxanium">{totalLikes}</span>
          </button>
          <button
            onClick={openComments}
            className="flex items-center gap-1 group"
          >
            <InteractiveIcon filled={seeComments} icon={MessageCircle} />
            <span className="text-sm font-oxanium">{totalComments}</span>
          </button>
          <div className="flex items-center gap-1">
            <EyeIcon className="size-5 text-primary" />
            <span className="text-sm font-oxanium">{totalViews.length}</span>
          </div>
        </div>

        {seeComments && (
          <>
            <div className="mt-4">
              <CommentInput
                sendComment={writeNewComment}
                hSize={80}
                placeholder="Write a comment"
                loadingComment={loadingComment}
              />
            </div>
            <div className="divider"></div>
            <h3 className="font-oxanium">Comments</h3>
            {loadingCommentSection ? (
              <Spinner size={20} />
            ) : (
              <>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentViewer
                      key={comment._id}
                      initialComment={comment}
                      setTotalComments={setTotalComments}
                      totalComments={totalComments}
                      getComments={getComments}
                    />
                  ))
                ) : (
                  <p>There is no comments yet, why not be the first?</p>
                )}
              </>
            )}
          </>
        )}
        <div></div>
      </div>
      {modalDelete && (
        <ModalAction
          title="Are you sure you want to delete this post?"
          setModalOpen={setModalDelete}
          handleAction={handleDeletePost}
        />
      )}
    </div>
  );
};

export default PostViewer;
