"use client";
import { communityStates } from "@/atoms/communitiesAtom";
import About from "@/components/Community/About";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Post/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type Props = {};

const SubmitPostPage = (props: Props) => {
  const [user] = useAuthState(auth);
  // const communityStateValue = useRecoilValue(communityStates);
  const { communityStateValue } = useCommunityData();
  // console.log(communityStateValue, "😏😏😏");
  return (
    <PageContent>
      <>
        <Box>
          <Text
            className=""
            padding="14px 0px "
            borderBottom="1px solid"
            borderColor="white"
          >
            Create a post
          </Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunities?.imageURL}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunities && (
          <About communityData={communityStateValue.currentCommunities} />
        )}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
