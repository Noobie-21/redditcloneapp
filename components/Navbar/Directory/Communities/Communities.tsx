"use client";

import { communityStates } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { auth } from "@/firebase/clientApp";
import { Box, Flex, Icon, MenuItem, MenuList, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import MenuListItem from "../MenuListItem";

type CommunitiesProps = {};

const Communities = (props: CommunitiesProps) => {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const mySnippets = useRecoilValue(communityStates).mySnippets;
  // console.log(mySnippets, "sdfsdfsdf");

  return (
    <>
      <CreateCommunityModal
        open={open}
        handleClose={() => setOpen(false)}
        userId={user?.uid!}
      />

      <Box mt={3} my={3}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.400"}
        >
          MODETRATING
        </Text>

        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{
            bg: "gray.100",
          }}
        >
          <Flex
            align={"center"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Icon as={GrAdd} fontSize={20} mr={1} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              iconColor="blue.500"
              link={`/r/${snippet.communityId}`}
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} my={3}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.400"}
        >
          MY COMMUNITIES
        </Text>

        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{
            bg: "gray.100",
          }}
        ></MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            iconColor="blue.500"
            link={`/r/${snippet.communityId}`}
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
