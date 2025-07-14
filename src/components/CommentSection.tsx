import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import CommentItem from "./CommentItem";

interface Props {
  id: number;
}

interface NewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface Comments {
  id: number;
  author: string;
  user_id: string;
  parent_comment_id: number | null;
  content: string;
  post_id: number;
  created_at: string;
}

const createComment = async (
  newComment: NewComment,
  id: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("you need to be logged in to comment");
  }

  const { error } = await supabase.from("comments").insert({
    author,
    user_id: userId,
    parent_comment_id: newComment.parent_comment_id || null,
    content: newComment.content,
    post_id: id,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (id: number): Promise<Comments[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);
  return data as Comments[];
};

function CommentSection({ id }: Props) {
  const { user } = useAuth();
  const [newCommentText, setNewCommentText] = useState("");
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comments[]>({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) => {
      return createComment(
        newComment,
        id,
        user?.id,
        user?.user_metadata.user_name
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", id],
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;

    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const buildCommentTree = (
    flatComments: Comments[]
  ): (Comments & { children?: Comments[] })[] => {
    const map = new Map<number, Comments & { children?: Comments[] }>();
    const roots: (Comments & { children?: Comments[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div>Loading Comments...</div>;
  }

  if (error) {
    return <div>Error : {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            rows={3}
            placeholder="Write a comment"
            onChange={(e) => setNewCommentText(e.target.value)}
            value={newCommentText}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            disabled={!newCommentText}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post comment"}
          </button>
          {isError && <p className="text-red-500">Error posting comment</p>}
        </form>
      ) : (
        <p className="mb-4 text-gray-600"> You must be logged in to comment</p>
      )}

      {/* SHOW_COMMENT */}
      <div className="space-y-4">
        {commentTree.map((comment) => (
          <CommentItem comment={comment} key={comment.id} id={id} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
