import { useState, type FormEvent } from "react";
import type { Comments } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comments & {
    children?: Comments[];
  };
  id: number;
}

const createReply = async (
  replyContent: string,
  id: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("you need to be logged in to reply");
  }

  const { error } = await supabase.from("comments").insert({
    author,
    user_id: userId,
    parent_comment_id: parentCommentId,
    content: replyContent,
    post_id: id,
  });

  if (error) throw new Error(error.message);
};

function CommentItem({ comment, id }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();
  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) => {
      return createReply(
        replyContent,
        id,
        comment.id,
        user?.id,
        user?.user_metadata.user_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", id],
      });
      setReplyText("");
      setShowReply(false);
    },
  });
  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          {/* DISPLAY USERNAME */}
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>

        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-blue-500 text-sm mt-1"
        >
          {showReply ? "Cancel" : "Reply"}{" "}
        </button>
      </div>
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-4">
          <textarea
            rows={2}
            placeholder="Write a reply"
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            // disabled={!replyText}
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply</p>}
        </form>
      )}

      {/* CHILDREN_COMMENT */}
      {comment.children && comment.children.length > 0 && (
        <div>
          <button onClick={() => setIsCollapsed((prev) => !prev)}>
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>

          {!isCollapsed && <div className="space-y-2">
            {comment.children.map(child=>(
              <CommentItem key={child.id} comment={child} id={id} />
            ))}
            </div>}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
