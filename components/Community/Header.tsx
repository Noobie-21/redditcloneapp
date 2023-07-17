"use client";
import { Community, communityStates } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "@/hooks/useCommunityData";

type HeaderProps = {
  communityData: any;
  isJoined: boolean;
};

const Header = ({ communityData }: HeaderProps) => {
  const { onJoinedOrLeaveCommunity, communityStateValue, loading } =
    useCommunityData();
  // console.log(communityData.CreateId);
  const [currentImage, setCurrentImage] = useState("");

  const isJoined = !!communityStateValue.mySnippets.find(
    (item: any) => item.communityId === communityData.id
  );

  useEffect(() => {
    if (!communityStateValue.currentCommunities?.imageURL) {
      setCurrentImage(communityData.imageURL);
    } else {
      setCurrentImage(communityStateValue.currentCommunities?.imageURL);
    }
  }, [communityData, communityStateValue.currentCommunities?.imageURL]);

  // console.log(currentImage, "<=========>");

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="660px">
          {currentImage ? (
            <Image
              src={currentImage}
              borderRadius={"full"}
              boxSize="66px"
              alt="Profile Image"
              position="relative"
              top={-3}
              className="bg-cover bg-center"
              color={"blue.500"}
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              position="relative"
              fontSize={64}
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction={"column"} mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={800} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              className={`bg-blue-500 uppercase h-[36px] pr-6 pl-6 ${
                isJoined
                  ? "bg-white border text-blue-400 border-blue-500 "
                  : "bg-blue-500"
              } hover:text-black`}
              onClick={() => {
                onJoinedOrLeaveCommunity(communityData, isJoined, currentImage);
              }}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
