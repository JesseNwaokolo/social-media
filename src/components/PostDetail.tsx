import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../lib/supabase";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

function PostDetail({ id }: { id: number }) {
  const { data, isLoading, error } = useQuery<Post, Error>({
    queryKey: ["postDetails", id],
    queryFn: () => fetchPostById(id),
  });

  if (isLoading) return <div>Loading Posts...</div>;

  if (error) return <div>Error : {error.message}</div>;

 

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>

      {data?.image_url && (
        <img
          src={data?.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )} 

      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">Posted on: {new Date(data!.created_at).toLocaleDateString()}</p>

      <LikeButton id={id} />
      <CommentSection id={id} />
    </div>
  );
}

export default PostDetail;
