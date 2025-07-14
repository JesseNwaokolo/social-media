import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPost = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);
  return data as Post[];
};

function PostList() {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPost,
  });

  if (isLoading) return <div>Loading posts...</div>;

  if (error) return <div>Error : {error.message}</div>;

  if (data?.length === 0) return <p>No posts yet</p>;

  // console.log(data);
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
}

export default PostList;
