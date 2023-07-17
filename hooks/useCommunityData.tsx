"use client";
import { authModalState } from "@/atoms/authModal";
import {
  Community,
  CommunitySnippets,
  communityStates,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityStates);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const setAuthModalState = useSetRecoilState(authModalState);
  const onJoinedOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean,
    currentImage: string
  ) => {
    // if user is not logged in

    if (!user) {
      setAuthModalState({ view: "login", open: true });
      return;
    }

    // is the user signed in
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData, currentImage);
  };
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDoc = await getDocs(
        collection(firestore, `Users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDoc.docs.map((doc) => ({ ...doc.data() }));
      // console.log("Snippets Data : 😍", snippets);
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippets[],
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("getMySnippets", error.message);
      setError(error.message);
    }
  };

  const joinCommunity = async (
    communityData: Community,
    currentImage: string
  ) => {
    // batch write
    // creating a new community snippets
    // updating number of memebers (1)
    console.log(communityData.CreateId, ":-)☆*: .｡. o(≧▽≦)o .｡.:*☆");

    setLoading(true);

    try {
      // we are creating a new community Snippets with the help of batch writes.

      const batch = writeBatch(firestore); // we are creating new batch nippets with the help of writeBatch
      const newSnippets: CommunitySnippets = {
        communityId: communityData.id,
        imageURL: currentImage || "",
        isModerator: user?.uid === communityData?.CreateId,
      }; // this is newSnippets skelton body
      batch.set(
        doc(
          firestore,
          `Users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippets
      ); // writing the data into firestore with help of set(batch writing)

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMember: increment(1),
      }); // updating the data of no. of members in communities bucket with using of upadte
      await batch.commit(); // this function is important , without this we cannot update or write batch file in database

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippets],
      })); // upadating UI handle tooo
      setLoading(false);
    } catch (error: any) {
      console.log("Join community Error", error.message);
      setError(error.message);
    }
    // update recoil satete - communityState.mySnippets
  };
  const leaveCommunity = async (communityId: string) => {
    // batch write
    // deleting the community snippets from user
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `Users/${user?.uid}/communitySnippets`, communityId)
      );
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMember: increment(-1),
      });
      await batch.commit();
      // updating the numberOfMembers (-1)
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
      setLoading(false);
    } catch (error: any) {
      console.log("Leave Communit Error , ", error.message);
      setError(error.message);
    }
  };

  const getCommunityData = async (postId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", postId);
      const communityDoc = await getDoc(communityDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunities: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("Error :", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const pid = params.communityId;
    if (pid && !communityStateValue.currentCommunities) {
      getCommunityData(pid);
    }
  }, [params.communityId, communityStateValue.currentCommunities]);

  return {
    // data and functions
    communityStateValue,
    onJoinedOrLeaveCommunity,
    loading,
  };
};

export default useCommunityData;
