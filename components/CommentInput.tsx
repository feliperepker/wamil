import { LoaderIcon, SendHorizonal } from "lucide-react";
import { FormEvent, RefObject, useRef, useState } from "react";

const CommentInput = ({
  sendComment,
  hSize,
  placeholder,
  loadingComment,
}: {
  sendComment: (textAreaRef: RefObject<HTMLTextAreaElement | null>) => void;
  hSize: number;
  placeholder: string;
  loadingComment: boolean;
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
      />
      {isFocused && (
        <button
          onClick={() => {
            sendComment(textareaRef);
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
