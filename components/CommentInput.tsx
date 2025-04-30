import { LoaderIcon, SendHorizonal } from "lucide-react";
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { CommentType } from "./CommentViewer";

const CommentInput = ({
  sendComment,
  hSize,
  placeholder,
  loadingComment,
  comment,
  starterComment,
}: {
  sendComment: (
    textAreaRef: RefObject<HTMLTextAreaElement | null>,
    commentId?: CommentType
  ) => void;
  hSize: number;
  placeholder: string;
  loadingComment: boolean;
  comment?: CommentType;
  starterComment?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const checkScrollbar = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setHasScrollbar(textarea.scrollHeight > textarea.clientHeight);
    }
  };

  useEffect(() => {
    if (starterComment && textareaRef.current) {
      textareaRef.current.value = starterComment ?? "";
      textareaRef.current.focus();
    }
  }, [starterComment]);

  return (
    <div className="relative max-w-full mt-4">
      <textarea
        ref={textareaRef}
        id="comment"
        name="comment"
        placeholder={placeholder}
        className="w-full p-2 pr-16 max-h-[200px] bg-black-100 resize-none rounded font-oxanium text-sm text-white focus:outline-none focus:ring-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={checkScrollbar}
        style={{ height: `${hSize}px` }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendComment(textareaRef, comment);
          }
        }}
      />
      {isFocused && (
        <button
          onClick={() => {
            sendComment(textareaRef, comment);
          }}
          onMouseDown={(e) => e.preventDefault()}
          type="submit"
          disabled={loadingComment}
          className={`absolute bottom-0 ${hasScrollbar ? "right-5" : "right-2"} rounded-full p-2 -translate-y-1/2 bg-secondary text-white transition-all`}
        >
          {loadingComment ? (
            <LoaderIcon className="size-5" />
          ) : (
            <SendHorizonal className="size-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default CommentInput;
