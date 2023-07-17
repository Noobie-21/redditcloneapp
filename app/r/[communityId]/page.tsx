"use client";
import { Community, communityStates } from "@/atoms/communitiesAtom";
import About from "@/components/Community/About";
import CreatePostLink from "@/components/Community/CreatePostCommunity";
import CreatePostCommunity from "@/components/Community/CreatePostCommunity";
import Header from "@/components/Community/Header";
import CommunityNotFound from "@/components/Community/NotFound";
import NotFound from "@/components/Community/NotFound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Post/Posts";
import { firestore } from "@/firebase/clientApp";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
type CommunityPagesProps = {
  id: string;
  createId: string;
  numberOfMember: number;
  privacyType: "public" | "private" | "restricted";
  createdAt?: Timestamp;
  imageURL?: string;
};

// interface CommunitiesData {
//   dataOfCommunity: Community;
// }

const CommunityPages = (props: any) => {
  const isJoined = false;
  const params = useParams();
  const setCommunityStateValue = useSetRecoilState(communityStates);
  const [communityData, setCommunityData] = useState<{ [key: string]: any }>(
    []
  );
  const [error, setError] = useState(false);

  const getData = async () => {
    try {
      const communityDocRef = doc(firestore, "communities", params.communityId);
      const communityDoc = await getDoc(communityDocRef);
      const dataOfCommunity = JSON.parse(
        safeJsonStringify({ ...communityDoc.data(), id: communityDoc.id })
      );
      if (!communityDoc.exists()) {
        setError(true);
        return;
      }
      setCommunityData(dataOfCommunity);
      setError(false);
    } catch (error: any) {
      console.log("Get server side Props : ", error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  // console.log(communityData);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunities: communityData as any,
    }));
  }, [communityData]);
  return (
    <div>
      {error ? (
        <CommunityNotFound />
      ) : (
        <>
          <Header communityData={communityData} isJoined={isJoined} />
          <PageContent>
            <>
              <CreatePostLink />
              <Posts communityData={communityData} />
            </>
            <>
              <About communityData={communityData} />
            </>
          </PageContent>
        </>
      )}
    </div>
  );
};

export default CommunityPages;
