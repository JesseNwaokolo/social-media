import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

function PostItem({ post }: Props) {
  return (
    <div className="relative group ">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[(84,90,106)] rounded-[20px] text-white flex flex-col p-4">
          {/* HEADER */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="user-avatar"
                className="size-[35px] object-cover rounded-full"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8a2be2] to-[#491f70] " />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2">
                {post.title}
              </div>
            </div>
          </div>

          {/* IMAGE_BANNER */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto"
              loading="lazy"
            />
          </div>

          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤<span className="ml-2">{post.like_count ?? 0}</span>
            </span>

            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💭<span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostItem;
