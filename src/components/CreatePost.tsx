import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import type { Community } from "./CommunitiesList";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id : number | null
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

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicUrlData.publicUrl });

  if (error) throw new Error(error.message);
  return data;
};

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => navigate("/"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id : communityId
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCommunityChange = (e:ChangeEvent<HTMLSelectElement>)=>{
    const {value} = e.target
    setCommunityId(value ? Number(value) : null)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full border border-white/20 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full border border-white/20 bg-transparent p-2 rounded resize-none"
        />
      </div>

      <div>
        <label htmlFor="community">Select Community</label>
        <select name="" id="comunnity" className="bg-black text-white" onChange={handleCommunityChange}>
          <option value="">-- Choose a community --</option>
          {communities?.map((community) => (
            <option key={community.id} value={community.id} >
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Uploade Image
        </label>
        <input
          id="image"
          type="file"
          required
          onChange={handleFileChange}
          accept="image/*"
          className="w-full text-gray-200 border rounded p-1 border-white/20 cursor-pointer"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500">Error creating post </p>}
    </form>
  );
}

export default CreatePost;
