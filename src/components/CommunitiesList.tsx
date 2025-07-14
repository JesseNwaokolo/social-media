import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw new Error(error.message);

  return data as Community[];
};

function CommunitiesList() {
  const { data, isPending, error } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isPending) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error : {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((commuity) => {
        return (
          <div
            key={commuity.id}
            className="border border-white/20 p-4 rounded hover:-translate-y-1 transition transform"
          >
            <Link
              to={`/community/${commuity.id}`}
              className="text-2xl font-bold text-purple-500 hover:underline"
            >
              {commuity.name}
            </Link>
            <p className="text-gray-400 mt-2">{commuity.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CommunitiesList;
