"use client";
import { communityStates } from "@/atoms/communitiesAtom";
import { Post, PostVotes } from "@/atoms/postAtoms";
import About from "@/components/Community/About";
import CreatePostLink from "@/components/Community/CreatePostCommunity";
import PersonalHome from "@/components/Community/Personal";
import Premium from "@/components/Community/Premium";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Post/PostItem";
import PostLoader from "@/components/Post/PostLoader";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
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
  // const communityStateValue = useRecoilValue(communityStates);
  const { communityStateValue } = useCommunityData();
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
  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postQuery = query(
        collection(firestore, `Users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVotes[],
      }));
    } catch (error: any) {
      console.log("Error : ", error.message);
    }
  };

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (communityStateValue.snippetFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetFetched]);
  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);
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
      <>
        {/* <About communityData={communi}/> */}
        <Stack spacing={2}>
          <Premium />
          <PersonalHome />
        </Stack>
      </>
    </PageContent>
  );
}
