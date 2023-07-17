"use client";
import { Post } from "@/atoms/postAtoms";
import About from "@/components/Community/About";
import PageContent from "@/components/Layout/PageContent";
import Comments from "@/components/Post/Comments/Comments";
import PostItem from "@/components/Post/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { User } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type CommentPageProps = {};

const PostPage = (props: CommentPageProps) => {
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const [user] = useAuthState(auth);
  const params = useParams();
  const { communityStateValue } = useCommunityData();
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "Posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("Error Occured :", error.message);
    }
  };
  useEffect(() => {
    const pid = params.commentId;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [params.commentId, postStateValue.selectedPost]);
  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.votesValue
            }
            userIsCretor={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments
          communityId={postStateValue.selectedPost?.communityId as string}
          selectedPost={postStateValue.selectedPost}
          user={user as User}
        />
      </>
      <>
        {communityStateValue.currentCommunities && (
          <About communityData={communityStateValue.currentCommunities} />
        )}
      </>
    </PageContent>
  );
};

export default PostPage;
