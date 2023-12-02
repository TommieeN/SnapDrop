import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import commentIcon from "../../../public/assets/icons/comment.svg";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreateComment,
  useDeletePost,
  useGetCommentsByPostId,
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { data: post, isPending } = useGetPostById(id || "");
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { data: comments, isPending: isCommentsLoading } = useGetCommentsByPostId(id || "")

  const { mutate: deletePost } = useDeletePost();
  const { mutate: createComment } = useCreateComment();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const [commentText, setCommentText] = useState("");

  console.log("comments data", comments)
  const handleCommentSubmit = async (commentText: any) => {
    try {
      await createComment({
        postId: post?.$id,
        text: commentText,
        creator: user.id,
      });
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                className="flex items-center gap-3"
                to={`/profile/${post?.creator.$id}`}
              >
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDate(post?.$createdAt || "")}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-2">
                <Link
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                  to={`/update-post/${post?.$id}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    width={24}
                    height={24}
                    alt="edit"
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* {comments?.documents[0].text} */}
              {comments?.documents.map((comment: any) => {
                return (
                  <p>{comment.text}</p>
                )
              })}
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
            <div className="flex w-full items-center">
              <img
                className="h-[40px] w-[40px] mr-[11px] rounded-full"
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              />
              <Input
                className=" bg-dark-3 border-none"
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
              />
              <button onClick={() => handleCommentSubmit(commentText)}>
                <img
                  className="ml-[11px]"
                  src={commentIcon}
                  alt="comment-button"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
