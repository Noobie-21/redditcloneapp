import { authModalState } from "@/atoms/authModal";
import { communityStates } from "@/atoms/communitiesAtom";
import { Post, PostVotes, postState } from "@/atoms/postAtoms";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const currentCommunity = useRecoilValue(communityStates).currentCommunities;
  const router = useRouter();

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    // check for a user => if not , open auth modal
    event?.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { voteStatus } = post;
    const existingVotes = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );
    console.log(existingVotes, post.id, "hello there");

    try {
      // check the person already voted
      let voteChanges = vote;
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      console.log(updatedPostVotes, "😂😂☺☺");
      // new Vote
      if (!existingVotes) {
        const postVoteRef = doc(
          collection(firestore, "Users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVotes = {
          id: postVoteRef.id,
          postId: post.id as string,
          votesValue: vote,
          communityId,
        };
        console.log(newVote, ": new vote🥱");
        batch.set(postVoteRef, newVote);
        // await batch.commit();
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "Users",
          `${user?.uid}/postVotes/${existingVotes.id}`
        );

        // Removing vote
        if (existingVotes?.votesValue === vote) {
          // voteChanges *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVotes.id
          );

          // delete Post votes operations

          batch.delete(postVoteRef);
          voteChanges *= -1;
        }
        // Flipping the Vote
        else {
          voteChanges = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVotes.id
          );
          console.log(voteIndex, "😋");
          if (voteIndex !== -1) {
            updatedPostVotes[voteIndex] = {
              ...existingVotes,
              votesValue: vote,
            };
          }

          batch.update(postVoteRef, {
            votesValue: vote,
          });
        }

        // Removing the vote {up => down and down => up}
      }

      // Update state witht updated values
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      console.log(postIdx, "😋");
      updatedPosts[postIdx!] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        post: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
      const postRef = doc(firestore, "Posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChanges });

      await batch.commit();

      // update satet update

      // check the person didn't vote
      // console.log(updatedPost, updatedPostVotes, updatedPosts, "🙂🤗");
    } catch (error: any) {
      console.log("New Vote Error : ", error.message);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comment/${post.id}`);
  };

  const onDeletePost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ): Promise<boolean> => {
    event.stopPropagation();
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete Post document from firestore

      const postDocRef = doc(firestore, "Posts", post.id!);
      await deleteDoc(postDocRef);

      // update recoil state

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVoteQuery = query(
      collection(firestore, "Users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId || "")
    );
    const postVotesDocs = await getDocs(postVoteQuery);
    const postVotes = postVotesDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVotes[],
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity) return;
    getCommunityPostVotes(currentCommunity?.id);
  }, [currentCommunity, user]);

  useEffect(() => {
    // clear user post votes
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
