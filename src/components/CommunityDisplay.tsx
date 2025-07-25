import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Post } from "./PostList";
import PostItem from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithcomunities extends Post {
  communities: {
    name: string;
  };
}

const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithcomunities[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data as PostWithcomunities[];
};

function CommunityDisplay({ communityId }: Props) {
  const { data, isPending, error } = useQuery<PostWithcomunities[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isPending) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error : {error.message}
      </div>
    );

    
  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data.length > 0 && data[0].communities.name} Community Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 ">
          No posts in this community yet
        </p>
      )}
    </div>
  );
}

export default CommunityDisplay;
