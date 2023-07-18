"use client";
import { communityStates } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postAtoms";
import CreatePostLink from "@/components/Community/CreatePostCommunity";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Post/PostItem";
import PostLoader from "@/components/Post/PostLoader";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const communityStateValue = useRecoilValue(communityStates);
  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "Posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("Error : ", error.message);
    }
    setLoading(false);
  };
  const buildUserHomeFeed = async () => {
    /// get Post from user communities
    setLoading(true);
    try {
      // const postQuery =
      if (communityStateValue.mySnippets.length) {
        const myCommunityId = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "Posts"),
          where("communityId", "in", myCommunityId),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log("Error :", error.message);
    }
    setLoading(false);
  };
  const getUserPostVotes = () => {};

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (communityStateValue.mySnippets.length) return;
  }, [communityStateValue.mySnippets]);
  return (
    <PageContent>
      <>
        {/* Post Feed */}
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                onDeletePost={onDeletePost}
                onVote={onVote}
                post={post}
                onSelectPost={onSelectPost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.votesValue
                }
                userIsCretor={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* Recoomendation system */}</>
    </PageContent>
  );
}
