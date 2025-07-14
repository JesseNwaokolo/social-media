import { useParams } from "react-router";
import PostDetail from "../components/PostDetail";

function PostPage() {
  const {id} = useParams()
  return (
    <div className="p-10">
      <PostDetail id={Number(id)} />
    </div>
  );
}

export default PostPage;
