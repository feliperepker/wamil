import { SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";

const CommentInput = ({
  sendComment,
  hSize,
  placeholder,
}: {
  sendComment: () => void;
  hSize: number;
  placeholder: string;
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
    <form
      action={() => {
        sendComment();
      }}
    >
      <div className="relative max-w-full mt-4">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          className="w-full p-2 pr-16 max-h-[200px] bg-black-100 resize-none rounded font-oxanium text-sm text-white focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={checkScrollbar}
          style={{ height: `${hSize}px` }}
        />
        {isFocused && (
          <button
            type="submit"
            className={`absolute bottom-0 ${hasScrollbar ? "right-5" : "right-2"} rounded-full p-2 -translate-y-1/2 bg-secondary text-white transition-all`}
          >
            <SendHorizonal className="size-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentInput;
