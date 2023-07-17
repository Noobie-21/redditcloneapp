"use client";
import { Post } from "@/atoms/postAtoms";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type Props = {
  communityData: any;
  userId?: string;
};

const Posts = ({ communityData }: Props) => {
  const [loading, setLoading] = useState<Boolean>(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const [user] = useAuthState(auth);
  const getPosts = async () => {
    try {
      setLoading(true);
      // get post for this community
      const postQuery = query(
        collection(firestore, "Posts"),
        where("communityId", "==", communityData.id || ""),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(posts, communityData.id, "😊😉");
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("get posts error :", error.message);
    }
    // console.log(postStateValue, "😋");
    setLoading(false);
  };
  useEffect(() => {
    getPosts();
  }, [communityData]);
  // console.log("Post :", postStateValue);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => {
            // console.log(
            //   "check if it is correct or not : ",
            //   postStateValue.postVotes.find((vote) => vote.postId === post.id)
            //     ?.votesValue
            // );
            return (
              <PostItem
                key={post.id}
                post={post}
                userIsCretor={user?.uid === post.creatorId}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (vote) => vote.postId === post.id
                  )?.votesValue
                }
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};

export default Posts;
