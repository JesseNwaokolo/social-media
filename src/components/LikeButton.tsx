import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface Props {
  id: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, post_id: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", post_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("votes").insert({
      post_id,
      user_id: userId,
      vote: voteValue,
    });

    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (id: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", id);
  if (error) throw new Error(error.message);

  return data as Vote[];
};

function LikeButton({ id }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", id],
    queryFn: () => fetchVotes(id),
    // refetchInterval: 10000,
  });

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be Logged In to vote");

      return vote(voteValue, id, user!.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", id] });
    },
  });

  if (isLoading) {
    return <div>Loading votes...</div>;
  }

  if (error) {
    return <div>Error : {error.message}</div>;
  }

  const likes = votes?.filter((item) => item.vote === 1).length || 0;
  const dislikes = votes?.filter((item) => item.vote === -1).length || 0;
  const userVote = votes?.find(v=> v.user_id === user?.id)?.vote 

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        className={`cursor-pointer px-3 py-1 rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
        onClick={() => mutate(1)}
      >
        👍: {likes}
      </button>
      <button  className={`cursor-pointer px-3 py-1 rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`} onClick={() => mutate(-1)}>
        👎: {dislikes}
      </button>
    </div>
  );
}

export default LikeButton;
