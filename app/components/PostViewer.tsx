import { PostCardType } from "./PostCard";
import markdownit from "markdown-it";
import { useRef, useState } from "react";
import { EyeIcon, MessageCircle, SendHorizonal, ThumbsUp, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CommentViewer, { CommentType } from "./CommentViewer";


const md = markdownit({
    breaks: true,
    linkify: true,
});

const PostViewer = ({ post, onClose }: { post: PostCardType; onClose: () => void }) => {
    const parsedContent = md.render(post.post || "");
    const [seeComments, setSeeComments] = useState<boolean>(false);
    const [allComments, setAllComments] = useState<CommentType[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [hasScrollbar, setHasScrollbar] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const checkScrollbar = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            setHasScrollbar(textarea.scrollHeight > textarea.clientHeight);
        }
    };
    
    const openComments = () => {
        setSeeComments(!seeComments)
        setAllComments([...allComments, {
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
            likes:2,
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
            parentComments: [
              {
                _id: "comment456",
                _type: "comment",
                _createdAt: "2025-02-22T10:15:00Z",
                _updatedAt: "2025-02-22T10:45:00Z",
                _rev: "r1",
                comment: "Comentário pai deste comentário.",
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
                parentComments: [],
              },
            ],
          }])
    }

    const writeNewComment = () =>{

    }

    return (
        <div className="fixed inset-0 bg-[#1111119f] flex items-center justify-center p-6 z-50">
            <div className="bg-black w-full overflow-y-auto max-w-3xl p-4 rounded-lg shadow-lg max-h-full">
                <div className="flex justify-between items-start">
                    <h2 className="font-oxanium text-xl font-semibold max-w-[90%]">{post.title}</h2>
                    <button 
                        onClick={onClose}>
                        <X width={18}/>
                    </button>
                </div>
             
                <div className="flex items-center gap-3 my-3">
                    <img src={post.author?.image} alt={post.author?.name} className="w-8 h-8 rounded-full" />
                    <div className="leading-none font-oxanium">
                        <p>{post.author?.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(post._createdAt)}</p>
                    </div>
                </div>

                <div className="divder"></div>
                <article className="prose overflow-y-auto prose-invert mt-4 break-words text-base w-full max-h-[82%]" dangerouslySetInnerHTML={{ __html: parsedContent }} />
                <div className="divider"></div>
                
                <div className="flex gap-3 mt-4">
                    <button className="flex items-center gap-1">
                        <ThumbsUp className="size-5 text-primary" />
                        <span className="text-sm font-oxanium">{post.likes}</span>
                    </button>
                    <button onClick={openComments} className="flex items-center gap-1">
                        <MessageCircle className="size-5 text-primary" />
                        <span className="text-sm font-oxanium">{post.totalComments}</span>
                    </button>
                    <div className="flex items-center gap-1">
                        <EyeIcon className="size-5 text-primary" />
                        <span className="text-sm font-oxanium">{post.views}</span>
                    </div>
                </div>

              
                    <div className="mt-4">
                        <form action={() =>{
                            writeNewComment()
                        }}
                        >
                        <div className="relative w-full">
                            <textarea
                                ref={textareaRef}
                                placeholder="Write a new comment"
                                className="w-full p-2 pr-16 h-20 max-h-[200px] bg-black-100 resize-none rounded font-oxanium text-sm text-white focus:outline-none focus:ring-0"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onInput={checkScrollbar} // Atualiza quando o usuário digita
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
                    </div>  
                    {
                        seeComments && (
                        <>
                            <div className="divider"></div>
                            <h3 className="font-oxanium">Comments</h3>
                                {
                                   allComments.length > 0 ? allComments.map((comment) =>{
                                        return (
                                            <>
                                                <CommentViewer key={comment._id} commentObject={comment}/>
                                                <div className="divider"></div>
                                            </>
                                        )
                                    })
                                    : <p>No comments yet, why not be the first?</p>
                                }
                        </>)
                        
                    }
                    <div>
                    </div>
            </div>
        </div>
    );
};


export default PostViewer;